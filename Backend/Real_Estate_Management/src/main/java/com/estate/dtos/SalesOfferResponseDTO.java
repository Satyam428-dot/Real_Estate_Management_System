package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import com.estate.entities.enums.OfferStatus;
import lombok.Data;

@Data
public class SalesOfferResponseDTO {
    private Long offerId;
    private Long propertyId;
    private String propertyTitle;
    private BigDecimal propertyPrice;
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private Long ownerId;
    private BigDecimal offerPrice;
    private BigDecimal counterPrice;
    private LocalDate offerDate;
    private OfferStatus offerStatus;
    private String notes;
}