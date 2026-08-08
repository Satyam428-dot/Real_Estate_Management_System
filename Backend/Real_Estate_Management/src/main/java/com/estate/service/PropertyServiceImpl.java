package com.estate.service;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.PropertyImageDTO;
import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.PropertyUpdateDTO;
import com.estate.entities.Property;
import com.estate.entities.PropertyImage;
import com.estate.entities.User;
import com.estate.entities.UserRole;
import com.estate.entities.enums.PropertyStatus;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service


@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyServiceImpl implements PropertyService {
	private static final int MAX_IMAGES_PER_PROPERTY = 10;

	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;
	private final CloudinaryService cloudinaryService;

	@Override
	@Transactional
	public PropertyResponseDTO addProperty(PropertyRequestDTO dto, String ownerEmail) {
		User owner = findOwner(ownerEmail);

		Property property = new Property();
		property.setOwner(owner);
		property.setTitle(dto.getTitle());
		property.setDescription(dto.getDescription());
		property.setPrice(dto.getPrice());
		property.setPropertyType(dto.getPropertyType());
		property.setListingType(dto.getListingType());
		property.setAddress(dto.getAddress());
		property.setCity(dto.getCity());
		property.setState(dto.getState());
		property.setPinCode(dto.getPinCode());
		property.setBedrooms(dto.getBedrooms());
		property.setBathrooms(dto.getBathrooms());
		property.setHalls(dto.getHalls());
		property.setAreaSqft(dto.getAreaSqft());
		property.setAmenities(dto.getAmenities());
		property.setHighlights(dto.getHighlights());
		return toResponse(propertyRepo.save(property));
	}

	@Override
	public List<PropertyResponseDTO> listAllProperty() {
		return propertyRepo.findAll().stream().map(this::toResponse).toList();
	}

	@Override
	public List<PropertyResponseDTO> listAvailableProperties() {
		return propertyRepo.findByStatusAndVerificationStatusAndBlacklistFalse(PropertyStatus.AVAILABLE, com.estate.entities.VerificationStatus.APPROVED).stream().map(this::toResponse)
				.toList();
	}

	@Override
	public List<PropertyResponseDTO> getPropertiesByOwnerId(Long ownerId) {
		return propertyRepo.findByOwnerId(ownerId).stream().map(this::toResponse).toList();
	}

	@Override
	public PropertyResponseDTO getProperty(Long id) {
		return toResponse(findProperty(id));
	}

	@Override
	@Transactional
	public PropertyResponseDTO updateProperty(Long id, PropertyUpdateDTO dto) {
		Property property = findProperty(id);
		if (dto.getTitle() != null)
			property.setTitle(dto.getTitle());
		if (dto.getDescription() != null)
			property.setDescription(dto.getDescription());
		if (dto.getPrice() != null)
			property.setPrice(dto.getPrice());
		if (dto.getPropertyType() != null)
			property.setPropertyType(dto.getPropertyType());
		if (dto.getListingType() != null)
			property.setListingType(dto.getListingType());
		if (dto.getAddress() != null)
			property.setAddress(dto.getAddress());
		if (dto.getCity() != null)
			property.setCity(dto.getCity());
		if (dto.getState() != null)
			property.setState(dto.getState());
		if (dto.getPinCode() != null)
			property.setPinCode(dto.getPinCode());
		if (dto.getBedrooms() != null)
			property.setBedrooms(dto.getBedrooms());
		if (dto.getBathrooms() != null)
			property.setBathrooms(dto.getBathrooms());
		if (dto.getHalls() != null)
			property.setHalls(dto.getHalls());
		if (dto.getAreaSqft() != null)
			property.setAreaSqft(dto.getAreaSqft());
		if (dto.getStatus() != null)
			property.setStatus(dto.getStatus());
		if (dto.getBlacklist() != null)
			property.setBlacklist(dto.getBlacklist());
		if (dto.getAmenities() != null)
			property.setAmenities(dto.getAmenities());
		if (dto.getHighlights() != null)
			property.setHighlights(dto.getHighlights());
		return toResponse(propertyRepo.save(property));
	}

	@Override
	@Transactional
	public PropertyResponseDTO uploadImages(Long id, List<MultipartFile> files, String ownerEmail) {
		Property property = findProperty(id);
		assertOwnedBy(property, ownerEmail);
		if (files == null || files.isEmpty())
			throw new IllegalArgumentException("At least one image is required");
		if (property.getImages().size() + files.size() > MAX_IMAGES_PER_PROPERTY) {
			throw new IllegalArgumentException("A property can have at most " + MAX_IMAGES_PER_PROPERTY + " images");
		}

		for (MultipartFile file : files) {
			if (file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
				throw new IllegalArgumentException("Only non-empty image files are accepted");
			}
			try {
				CloudinaryService.UploadResult uploaded = cloudinaryService.uploadPropertyImage(file, id);
				PropertyImage image = new PropertyImage();
				image.setImageUrl(uploaded.secureUrl());
				image.setPublicId(uploaded.publicId());
				image.setIsMain(property.getImages().isEmpty());
				image.setProperty(property);
				property.getImages().add(image);
			} catch (IOException e) {
				throw new IllegalStateException("Could not upload image to Cloudinary", e);
			}
		}
		return toResponse(propertyRepo.save(property));
	}

	@Override
	@Transactional
	public PropertyResponseDTO deletePropertyImage(Long propertyId, Long imageId) {
		Property property = findProperty(propertyId);
		PropertyImage targetImage = property.getImages().stream()
				.filter(img -> img.getId() == imageId)
				.findFirst()
				.orElseThrow(() -> new ResourceNotFoundException("Property image not found"));

		try {
			if (targetImage.getPublicId() != null) {
				cloudinaryService.deleteImage(targetImage.getPublicId());
			}
		} catch (IOException e) {
			// Log and proceed to orphan removal
		}

		property.getImages().remove(targetImage);
		return toResponse(propertyRepo.save(property));
	}

	@Override
	@Transactional
	public void deleteProperty(Long id) {
		Property property = findProperty(id);
		for (PropertyImage image : property.getImages()) {
			try {
				if (image.getPublicId() != null) {
					cloudinaryService.deleteImage(image.getPublicId());
				}
			} catch (IOException e) {
				// Proceed silently
			}
		}

		// Delete referencing child records from FK tables
		try { propertyRepo.deleteSavedPropertiesByPropertyId(id); } catch (Exception e) {}
		try { propertyRepo.deleteFavouritePropertiesByPropertyId(id); } catch (Exception e) {}
		try { propertyRepo.deleteLeasesByPropertyId(id); } catch (Exception e) {}
		try { propertyRepo.deleteMaintenanceRequestsByPropertyId(id); } catch (Exception e) {}
		try { propertyRepo.deleteSalesOffersByPropertyId(id); } catch (Exception e) {}

		propertyRepo.delete(property);
	}

	private Property findProperty(Long id) {
		return propertyRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Property not found"));
	}

	private User findOwner(String email) {
		User owner = userRepo.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
		if (owner.getUserRoles() != UserRole.OWNER) {
			throw new IllegalStateException("Only owners can create properties or upload property images");
		}
		return owner;
	}

	private void assertOwnedBy(Property property, String ownerEmail) {
		if (ownerEmail != null && property.getOwner() != null && property.getOwner().getEmail() != null
				&& !property.getOwner().getEmail().equalsIgnoreCase(ownerEmail)) {
			throw new IllegalStateException("You can upload images or documents only for your own properties");
		}
	}

	@Override
	public List<PropertyResponseDTO> listPendingProperties() {
		return propertyRepo.findByVerificationStatus(com.estate.entities.VerificationStatus.PENDING)
				.stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional
	public PropertyResponseDTO uploadPropertyVerificationDocs(Long id, MultipartFile titleDeed, MultipartFile taxReceipt, MultipartFile noc, String ownerEmail) {
		Property property = findProperty(id);
		assertOwnedBy(property, ownerEmail);

		try {
			if (titleDeed != null && !titleDeed.isEmpty()) {
				CloudinaryService.UploadResult uploaded = cloudinaryService.uploadPropertyDoc(titleDeed, id, "title_deed");
				property.setTitleDeedUrl(uploaded.secureUrl());
			}
			if (taxReceipt != null && !taxReceipt.isEmpty()) {
				CloudinaryService.UploadResult uploaded = cloudinaryService.uploadPropertyDoc(taxReceipt, id, "tax_receipt");
				property.setTaxReceiptUrl(uploaded.secureUrl());
			}
			if (noc != null && !noc.isEmpty()) {
				CloudinaryService.UploadResult uploaded = cloudinaryService.uploadPropertyDoc(noc, id, "noc");
				property.setNocCertificateUrl(uploaded.secureUrl());
			}
		} catch (Exception e) {
			System.err.println("Document upload warning: " + e.getMessage());
		}

		property.setVerificationStatus(com.estate.entities.VerificationStatus.PENDING);
		return toResponse(propertyRepo.save(property));
	}

	@Override
	@Transactional
	public PropertyResponseDTO updateVerificationStatus(Long id, com.estate.entities.VerificationStatus status, String rejectionReason) {
		Property property = findProperty(id);
		property.setVerificationStatus(status);
		if (status == com.estate.entities.VerificationStatus.REJECTED) {
			property.setRejectionReason(rejectionReason);
		} else if (status == com.estate.entities.VerificationStatus.APPROVED) {
			property.setRejectionReason(null);
		}
		return toResponse(propertyRepo.save(property));
	}

	private PropertyResponseDTO toResponse(Property property) {
		PropertyResponseDTO response = new PropertyResponseDTO();
		response.setPropertyId(property.getId());
		response.setOwnerId(property.getOwner().getId());
		response.setOwnerName(property.getOwner().getFirstName() + " " + property.getOwner().getLastName());
		response.setTitle(property.getTitle());
		response.setDescription(property.getDescription());
		response.setPrice(property.getPrice());
		response.setPropertyType(property.getPropertyType());
		response.setListingType(property.getListingType());
		response.setAddress(property.getAddress());
		response.setCity(property.getCity());
		response.setState(property.getState());
		response.setPinCode(property.getPinCode());
		response.setBedrooms(property.getBedrooms());
		response.setBathrooms(property.getBathrooms());
		response.setHalls(property.getHalls());
		response.setAreaSqft(property.getAreaSqft());
		response.setAmenities(property.getAmenities());
		response.setHighlights(property.getHighlights());
		response.setStatus(property.getStatus());
		response.setBlacklist(property.getBlacklist());
		response.setVerificationStatus(property.getVerificationStatus());
		response.setTitleDeedUrl(property.getTitleDeedUrl());
		response.setTaxReceiptUrl(property.getTaxReceiptUrl());
		response.setNocCertificateUrl(property.getNocCertificateUrl());
		response.setRejectionReason(property.getRejectionReason());
		response.setUpdatedAt(property.getUpdatedAt());
		response.setImages(property.getImages().stream()
				.sorted(Comparator.comparing(PropertyImage::getIsMain).reversed()).map(image -> {
					PropertyImageDTO dto = new PropertyImageDTO();
					dto.setId(image.getId());
					dto.setImageUrl(image.getImageUrl());
					dto.setIsMain(image.getIsMain());
					return dto;
				}).toList());
		return response;
	}
}
