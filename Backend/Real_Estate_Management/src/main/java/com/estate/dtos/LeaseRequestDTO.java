package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class LeaseRequestDTO {
    private Long propertyId;
    private Long tenantId;
    private Long ownerId;
    private LocalDate leaseStartDate;
    private LocalDate leaseEndDate;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
}