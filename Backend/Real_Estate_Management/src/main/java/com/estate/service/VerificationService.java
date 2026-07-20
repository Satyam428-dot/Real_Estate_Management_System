package com.estate.service;

import java.util.List;

import com.estate.dtos.PendingOwnerVerificationDto;
import com.estate.entities.VerificationStatus;

public interface VerificationService {

	List<PendingOwnerVerificationDto> getAllPendingOwnerRequests();

	String updateOwnerVerificationStatus(Long verificationId, VerificationStatus status);

}
