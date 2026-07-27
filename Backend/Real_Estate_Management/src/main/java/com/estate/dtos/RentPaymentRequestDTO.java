package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.estate.entities.enums.PaymentStatus;
import com.estate.entities.enums.PaymentType;

import lombok.Data;

@Data
public class RentPaymentRequestDTO {
    private Long propertyId;
    private Long tenantId;
    private Long ownerId;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private PaymentType paymentType;
    private PaymentStatus paymentStatus;
    private String transactionId;
}