package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.estate.entities.enums.ListingType;
import com.estate.entities.enums.PropertyStatus;
import com.estate.entities.enums.PropertyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyResponseDTO {

    private Long propertyId;

    private Long ownerId;

    private String ownerName;

    private String title;

    private String description;

    private BigDecimal price;

    private PropertyType propertyType;

    private ListingType listingType;

    private String address;

    private String city;

    private String state;

    private String pinCode;

    private Integer bedrooms;

    private Integer bathrooms;

    private Integer halls;

    private Integer areaSqft;

    private PropertyStatus status;

    private Boolean blacklist;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
