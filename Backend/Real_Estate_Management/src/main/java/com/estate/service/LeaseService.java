package com.estate.service;

import java.util.List;

import com.estate.dtos.LeaseRequestDTO;
import com.estate.dtos.LeaseResponseDTO;

public interface LeaseService {

	LeaseResponseDTO createLease(LeaseRequestDTO dto);

	List<LeaseResponseDTO> getLeaseByOwner(Long ownerId);

	List<LeaseResponseDTO> getLeaseByTenant(Long tenantId);

	LeaseResponseDTO getLeaseById(Long id);

	void terminateLease(Long id);

}
