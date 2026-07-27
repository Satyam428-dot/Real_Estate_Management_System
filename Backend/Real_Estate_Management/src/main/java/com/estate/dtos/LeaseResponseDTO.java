package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.estate.entities.enums.LeaseStatus;

import lombok.Data;

@Data
public class LeaseResponseDTO {
    private Long leaseId;
    private Long propertyId;
    private String propertyTitle;
    private Long tenantId;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;
    private Long ownerId;
    private LocalDate leaseStartDate;
    private LocalDate leaseEndDate;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private LeaseStatus leaseStatus;
}