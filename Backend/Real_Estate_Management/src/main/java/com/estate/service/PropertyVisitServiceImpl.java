package com.estate.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.customExceptions.UserNotFoundException;
import com.estate.dtos.ScheduleVisitRequestDTO;
import com.estate.dtos.VisitResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.PropertyVisit;
import com.estate.entities.User;
import com.estate.entities.enums.VisitStatus;
import com.estate.repository.PropertyRepository;
import com.estate.repository.PropertyVisitRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyVisitServiceImpl implements PropertyVisitService {

	private final PropertyVisitRepository visitRepo;
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;

	@Override
	@Transactional
	public VisitResponseDTO scheduleVisit(ScheduleVisitRequestDTO dto, String buyerEmail) {
		User buyer = userRepo.findByEmail(buyerEmail)
				.orElseThrow(() -> new UserNotFoundException("Buyer user not found: " + buyerEmail));

		Property property = propertyRepo.findById(dto.getPropertyId())
				.orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + dto.getPropertyId()));

		User owner = property.getOwner();

		PropertyVisit visit = PropertyVisit.builder().buyer(buyer).property(property).owner(owner)
				.fullName(dto.getFullName()).email(dto.getEmail()).phone(dto.getPhone()).visitDate(dto.getVisitDate())
				.timeSlot(dto.getTimeSlot()).visitTime(dto.getTimeSlot()).specificRequirements(dto.getSpecificRequirements())
				.messageToOwner(dto.getMessageToOwner()).status(VisitStatus.PENDING).build();

		PropertyVisit savedVisit = visitRepo.save(visit);
		return mapToDTO(savedVisit);
	}

	@Override
	public List<VisitResponseDTO> getBuyerVisits(String buyerEmail) {
		User buyer = userRepo.findByEmail(buyerEmail)
				.orElseThrow(() -> new UserNotFoundException("Buyer not found with email: " + buyerEmail));

		return visitRepo.findByBuyerId(buyer.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	@Override
	public List<VisitResponseDTO> getOwnerVisits(String ownerEmail) {
		User owner = userRepo.findByEmail(ownerEmail)
				.orElseThrow(() -> new UserNotFoundException("Owner not found with email: " + ownerEmail));

		return visitRepo.findByOwnerId(owner.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public VisitResponseDTO updateVisitStatus(Long visitId, VisitStatus status, String userEmail) {
		PropertyVisit visit = visitRepo.findById(visitId)
				.orElseThrow(() -> new ResourceNotFoundException("Visit request not found with ID: " + visitId));

		visit.setStatus(status);
		PropertyVisit updatedVisit = visitRepo.save(visit);
		return mapToDTO(updatedVisit);
	}

	@Override
	@Transactional
	public void cancelVisit(Long visitId, String buyerEmail) {
		PropertyVisit visit = visitRepo.findById(visitId)
				.orElseThrow(() -> new ResourceNotFoundException("Visit request not found with ID: " + visitId));

		visit.setStatus(VisitStatus.CANCELLED);
		visitRepo.save(visit);
	}

	private VisitResponseDTO mapToDTO(PropertyVisit visit) {
		String mainImage = null;
		if (visit.getProperty().getImages() != null && !visit.getProperty().getImages().isEmpty()) {
			mainImage = visit.getProperty().getImages().get(0).getImageUrl();
		}

		return VisitResponseDTO.builder().id(visit.getId()).propertyId(visit.getProperty().getId())
				.propertyTitle(visit.getProperty().getTitle()).propertyLocation(visit.getProperty().getAddress())
				.propertyCity(visit.getProperty().getCity()).propertyImage(mainImage).buyerId(visit.getBuyer().getId())
				.buyerName(visit.getBuyer().getFirstName() + " " + visit.getBuyer().getLastName())
				.ownerId(visit.getOwner().getId())
				.ownerName(visit.getOwner().getFirstName() + " " + visit.getOwner().getLastName())
				.fullName(visit.getFullName()).email(visit.getEmail()).phone(visit.getPhone())
				.visitDate(visit.getVisitDate()).timeSlot(visit.getTimeSlot())
				.specificRequirements(visit.getSpecificRequirements()).messageToOwner(visit.getMessageToOwner())
				.status(visit.getStatus()).createdOn(visit.getCreatedOn()).build();
	}
}