package com.estate.dtos;

import java.math.BigDecimal;
import com.estate.entities.enums.MaintenancePriority;
import com.estate.entities.enums.MaintenanceStatus;
import lombok.Data;

@Data
public class MaintenanceRequestDTO {
    private Long propertyId;
    private Long tenantId;
    private Long ownerId;
    private String title;
    private String description;
    private MaintenancePriority priority;
    private MaintenanceStatus status;
    private BigDecimal estimatedCost;
}
