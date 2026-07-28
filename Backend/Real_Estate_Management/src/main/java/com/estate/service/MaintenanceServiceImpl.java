package com.estate.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.dtos.MaintenanceRequestDTO;
import com.estate.dtos.MaintenanceResponseDTO;
import com.estate.entities.MaintenanceRequest;
import com.estate.entities.Property;
import com.estate.entities.User;
import com.estate.entities.enums.MaintenancePriority;
import com.estate.entities.enums.MaintenanceStatus;
import com.estate.repository.MaintenanceRequestRepository;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRepo;
    private final PropertyRepository propertyRepo;
    private final UserRepository userRepo;
    private final ModelMapper mapper;

    private MaintenanceResponseDTO convertToDTO(MaintenanceRequest request) {
        MaintenanceResponseDTO dto = mapper.map(request, MaintenanceResponseDTO.class);
        dto.setRequestId(request.getId());

        if (request.getProperty() != null) {
            dto.setPropertyId(request.getProperty().getId());
            dto.setPropertyTitle(request.getProperty().getTitle());
        }

        if (request.getTenant() != null) {
            dto.setTenantId(request.getTenant().getId());
            dto.setTenantName(request.getTenant().getFirstName() + " " + request.getTenant().getLastName());
        }

        if (request.getOwner() != null) {
            dto.setOwnerId(request.getOwner().getId());
        }

        return dto;
    }

    @Override
    public MaintenanceResponseDTO createRequest(MaintenanceRequestDTO dto) {
        Property property = propertyRepo.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User tenant = userRepo.findById(dto.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        User owner = userRepo.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        MaintenanceRequest request = MaintenanceRequest.builder()
                .property(property)
                .tenant(tenant)
                .owner(owner)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : MaintenancePriority.MEDIUM)
                .status(dto.getStatus() != null ? dto.getStatus() : MaintenanceStatus.PENDING)
                .requestDate(LocalDate.now())
                .estimatedCost(dto.getEstimatedCost())
                .build();

        MaintenanceRequest saved = maintenanceRepo.save(request);
        return convertToDTO(saved);
    }

    @Override
    public List<MaintenanceResponseDTO> getRequestsByOwner(Long ownerId) {
        List<MaintenanceRequest> requests = maintenanceRepo.findByOwnerId(ownerId);
        return requests.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<MaintenanceResponseDTO> getRequestsByTenant(Long tenantId) {
        List<MaintenanceRequest> requests = maintenanceRepo.findByTenantId(tenantId);
        return requests.stream().map(this::convertToDTO).toList();
    }

    @Override
    public MaintenanceResponseDTO getRequestById(Long id) {
        MaintenanceRequest request = maintenanceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
        return convertToDTO(request);
    }

    @Override
    public MaintenanceResponseDTO updateRequestStatus(Long requestId, String status, Double estimatedCost) {
        MaintenanceRequest request = maintenanceRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        MaintenanceStatus newStatus = MaintenanceStatus.valueOf(status.toUpperCase());
        request.setStatus(newStatus);

        if (newStatus == MaintenanceStatus.COMPLETED) {
            request.setResolvedDate(LocalDate.now());
        }

        if (estimatedCost != null) {
            request.setEstimatedCost(BigDecimal.valueOf(estimatedCost));
        }

        MaintenanceRequest saved = maintenanceRepo.save(request);
        return convertToDTO(saved);
    }
}
