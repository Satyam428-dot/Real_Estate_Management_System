package com.estate.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.estate.dtos.PendingOwnerVerificationDto;
import com.estate.entities.OwnerVerification;
import com.estate.entities.VerificationStatus;

public interface VerificationService {

	List<PendingOwnerVerificationDto> getAllPendingOwnerRequests();

	String updateOwnerVerificationStatus(Long verificationId, VerificationStatus status);

	VerificationStatus getOwnerVerificationStatus(Long ownerId);

	OwnerVerification submitOwnerVerification(Long ownerId, MultipartFile governmentIdProof, MultipartFile selfieImage) throws IOException;

	OwnerVerification getOwnerVerificationByOwnerId(Long ownerId);
}
