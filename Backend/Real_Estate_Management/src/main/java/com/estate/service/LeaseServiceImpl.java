package com.estate.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.estate.dtos.LeaseRequestDTO;
import com.estate.dtos.LeaseResponseDTO;
import com.estate.entities.Lease;
import com.estate.entities.Property;
import com.estate.entities.User;
import com.estate.entities.enums.LeaseStatus;
import com.estate.repository.LeaseRepository;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class LeaseServiceImpl implements LeaseService {
	
	private final LeaseRepository leaseRepo;
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;
	private final ModelMapper mapper;
	
	private LeaseResponseDTO convertToDTO (Lease lease) {
		LeaseResponseDTO dto = mapper.map(lease, LeaseResponseDTO.class);
		dto.setLeaseId(lease.getId());
		
		if(lease.getProperty() != null) {
			dto.setPropertyId(lease.getProperty().getId());
			dto.setPropertyTitle(lease.getProperty().getTitle());
		}
		
		if(lease.getTenant() != null) {
			dto.setTenantId(lease.getTenant().getId());
			dto.setTenantName(lease.getTenant().getFirstName() + " " + lease.getTenant().getLastName());
			dto.setTenantEmail(lease.getTenant().getEmail());
			dto.setTenantPhone(lease.getTenant().getPhone());
		}
		
		if(lease.getOwner() != null) {
			dto.setOwnerId(lease.getOwner().getId());
		}
		
		return dto;
	}

	@Override
	public LeaseResponseDTO createLease(LeaseRequestDTO dto) {
		Property property = propertyRepo.findById(dto.getPropertyId())
							.orElseThrow(() -> new RuntimeException("Property not found"));
		
		User tenant = userRepo.findById(dto.getTenantId())
						.orElseThrow(()-> new RuntimeException("Tenant not found"));
		
		User Owner = userRepo.findById(dto.getOwnerId())
				.orElseThrow(()-> new RuntimeException("Owner not found"));
		
		Lease lease = Lease.builder()
				.property(property)
				.tenant(tenant)
				.owner(Owner)
				.leaseStartDate(dto.getLeaseStartDate())
				.leaseEndDate(dto.getLeaseEndDate())
				.rentAmount(dto.getRentAmount())
				.depositAmount(dto.getDepositAmount())
				.leaseStatus(LeaseStatus.ACTIVE)
				.build();
		
		Lease savedLease = leaseRepo.save(lease);
		return convertToDTO(savedLease);
	}

	@Override
	public List<LeaseResponseDTO> getLeaseByOwner(Long ownerId) {
		List<Lease> leases = leaseRepo.findByOwnerId(ownerId);
		return leases.stream().map(this::convertToDTO).toList();
	}

	@Override
	public List<LeaseResponseDTO> getLeaseByTenant(Long tenantId) {
		List<Lease> leases = leaseRepo.findByTenantId(tenantId);
		return leases.stream().map(this::convertToDTO).toList();
	}

	@Override
	public LeaseResponseDTO getLeaseById(Long leaseId) {
		Lease lease = leaseRepo.findById(leaseId)
				.orElseThrow(()->new RuntimeException("Lease not found"));
		return convertToDTO(lease);
	}

	@Override
	public void terminateLease(Long leaseId) {
		Lease lease = leaseRepo.findById(leaseId)
				.orElseThrow(()-> new RuntimeException("Lease Not Found"));
		lease.setLeaseStatus(LeaseStatus.TERMINATED);
		leaseRepo.save(lease);
		
	}
}























