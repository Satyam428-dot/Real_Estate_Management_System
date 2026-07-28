package com.estate.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.estate.entities.MaintenanceRequest;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByOwnerId(Long ownerId);
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByPropertyId(Long propertyId);
}
