package com.estate.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.PropertyImageDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.SavedPropertyResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.PropertyImage;
import com.estate.entities.SavedProperty;
import com.estate.entities.User;
import com.estate.repository.PropertyRepository;
import com.estate.repository.SavedPropertyRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SavedPropertyServiceImpl implements SavedPropertyService {

	private final SavedPropertyRepository savedPropertyRepo;
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;

	@Override
	@Transactional
	public SavedPropertyResponseDTO saveProperty(Long propertyId, String buyerEmail) {
		User buyer = findBuyer(buyerEmail);
		Property property = propertyRepo.findById(propertyId)
				.orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

		// Check if already saved
		if (savedPropertyRepo.existsByBuyerIdAndPropertyId(buyer.getId(), propertyId)) {
			throw new IllegalStateException("Property is already saved");
		}

		SavedProperty savedProperty = SavedProperty.builder()
				.buyer(buyer)
				.property(property)
				.build();

		return toResponse(savedPropertyRepo.save(savedProperty));
	}

	@Override
	@Transactional
	public void unsaveProperty(Long propertyId, String buyerEmail) {
		User buyer = findBuyer(buyerEmail);

		SavedProperty savedProperty = savedPropertyRepo
				.findByBuyerIdAndPropertyId(buyer.getId(), propertyId)
				.orElseThrow(() -> new ResourceNotFoundException("Saved property not found"));

		savedPropertyRepo.delete(savedProperty);
	}

	@Override
	public List<SavedPropertyResponseDTO> getSavedProperties(String buyerEmail) {
		User buyer = findBuyer(buyerEmail);
		return savedPropertyRepo.findByBuyerId(buyer.getId())
				.stream()
				.map(this::toResponse)
				.toList();
	}

	@Override
	public boolean isPropertySaved(Long propertyId, String buyerEmail) {
		User buyer = findBuyer(buyerEmail);
		return savedPropertyRepo.existsByBuyerIdAndPropertyId(buyer.getId(), propertyId);
	}

	@Override
	public long getSavedCount(String buyerEmail) {
		User buyer = findBuyer(buyerEmail);
		return savedPropertyRepo.countByBuyerId(buyer.getId());
	}

	// -------------------- Helper Methods --------------------

	private User findBuyer(String email) {
		return userRepo.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
	}

	private SavedPropertyResponseDTO toResponse(SavedProperty savedProperty) {
		SavedPropertyResponseDTO dto = new SavedPropertyResponseDTO();
		dto.setSavedId(savedProperty.getId());
		dto.setSavedOn(savedProperty.getCreatedOn());
		dto.setProperty(toPropertyResponse(savedProperty.getProperty()));
		return dto;
	}

	private PropertyResponseDTO toPropertyResponse(Property property) {
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
		response.setStatus(property.getStatus());
		response.setBlacklist(property.getBlacklist());
		response.setUpdatedAt(property.getUpdatedAt());
		response.setImages(property.getImages().stream()
				.sorted(Comparator.comparing(PropertyImage::getIsMain).reversed())
				.map(image -> {
					PropertyImageDTO imgDto = new PropertyImageDTO();
					imgDto.setId(image.getId());
					imgDto.setImageUrl(image.getImageUrl());
					imgDto.setIsMain(image.getIsMain());
					return imgDto;
				}).toList());
		return response;
	}
}
