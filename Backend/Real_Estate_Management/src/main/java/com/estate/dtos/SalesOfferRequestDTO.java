package com.estate.dtos;

import java.math.BigDecimal;
import com.estate.entities.enums.OfferStatus;
import lombok.Data;

@Data
public class SalesOfferRequestDTO {
    private Long propertyId;
    private Long buyerId;
    private Long ownerId;
    private BigDecimal offerPrice;
    private BigDecimal counterPrice;
    private OfferStatus offerStatus;
    private String notes;
}