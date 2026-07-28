package com.estate.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.PendingOwnerVerificationDto;
import com.estate.entities.OwnerVerification;
import com.estate.entities.User;
import com.estate.entities.VerificationStatus;
import com.estate.repository.OwnerVerificationRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

	private final OwnerVerificationRepository ownerVerificationRepo;
	private final UserRepository userRepo;
	private final CloudinaryService cloudinaryService;
	private final ModelMapper mapper;

	@Override
	public List<PendingOwnerVerificationDto> getAllPendingOwnerRequests() {
		// 1. Fetch records in a single database round-trip
		List<OwnerVerification> pendingVerifications = ownerVerificationRepo
				.findByVerificationStatusWithUser(VerificationStatus.PENDING);

		if (pendingVerifications == null)
			throw new ResourceNotFoundException("No pending requests");

		// creating a list of PendingOwnerVerficationDto
		List<PendingOwnerVerificationDto> dtoList = new ArrayList<>();

		// 2. Map cleanly using ModelMapper inside a basic loop
		for (OwnerVerification entity : pendingVerifications) {
			PendingOwnerVerificationDto dto = mapper.map(entity, PendingOwnerVerificationDto.class);
			dtoList.add(dto);
		}

		return dtoList;
	}

	@Override
	@Transactional
	public String updateOwnerVerificationStatus(Long verificationId, VerificationStatus status) {
		// fetch the record with the verification id
		OwnerVerification entity = ownerVerificationRepo.findById(verificationId).orElseThrow(
				() -> new ResourceNotFoundException("Owner verification record not found with ID: " + verificationId));

		// update the status
		entity.setVerificationStatus(status);

		// Save the updated entity back to the database
		ownerVerificationRepo.save(entity);

		return "Verification status successfully updated to " + status;
	}

	@Override
	public VerificationStatus getOwnerVerificationStatus(Long ownerId) {
		OwnerVerification entity = ownerVerificationRepo.findByOwnerId(ownerId);
		if (entity == null) {
			return null;
		}
		return entity.getVerificationStatus();
	}

	@Override
	@Transactional
	public OwnerVerification submitOwnerVerification(Long ownerId, MultipartFile governmentIdProof, MultipartFile selfieImage) throws IOException {
		OwnerVerification existing = ownerVerificationRepo.findByOwnerId(ownerId);
		if (existing != null) {
			throw new IllegalStateException("Verification documents have already been submitted (Status: " + existing.getVerificationStatus() + "). Re-submission is not permitted.");
		}

		User owner = userRepo.findById(ownerId)
				.orElseThrow(() -> new ResourceNotFoundException("Owner user not found with ID: " + ownerId));

		CloudinaryService.UploadResult govUpload = cloudinaryService.uploadVerificationFile(governmentIdProof, ownerId, "gov_ids");
		CloudinaryService.UploadResult selfieUpload = cloudinaryService.uploadVerificationFile(selfieImage, ownerId, "selfies");

		OwnerVerification verification = new OwnerVerification();
		verification.setOwner(owner);
		verification.setGovernmentIdProof(govUpload.secureUrl());
		verification.setSelfieImage(selfieUpload.secureUrl());
		verification.setVerificationStatus(VerificationStatus.PENDING);
		verification.setVerificationDatetime(LocalDateTime.now());

		return ownerVerificationRepo.save(verification);
	}

	@Override
	public OwnerVerification getOwnerVerificationByOwnerId(Long ownerId) {
		return ownerVerificationRepo.findByOwnerId(ownerId);
	}

}
