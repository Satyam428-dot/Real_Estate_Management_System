package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.estate.entities.enums.MaintenancePriority;
import com.estate.entities.enums.MaintenanceStatus;

import lombok.Data;

@Data
public class MaintenanceResponseDTO {
    private Long requestId;
    private Long propertyId;
    private String propertyTitle;
    private Long tenantId;
    private String tenantName;
    private Long ownerId;
    private String title;
    private String description;
    private MaintenancePriority priority;
    private MaintenanceStatus status;
    private LocalDate requestDate;
    private LocalDate resolvedDate;
    private BigDecimal estimatedCost;
}
