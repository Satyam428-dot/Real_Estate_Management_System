package com.estate.service;

import java.util.List;
import com.estate.dtos.MaintenanceRequestDTO;
import com.estate.dtos.MaintenanceResponseDTO;

public interface MaintenanceService {
    MaintenanceResponseDTO createRequest(MaintenanceRequestDTO dto);
    List<MaintenanceResponseDTO> getRequestsByOwner(Long ownerId);
    List<MaintenanceResponseDTO> getRequestsByTenant(Long tenantId);
    MaintenanceResponseDTO getRequestById(Long id);
    MaintenanceResponseDTO updateRequestStatus(Long requestId, String status, Double estimatedCost);
}
