package com.estate.dtos;

import java.math.BigDecimal;

import com.estate.entities.enums.ListingType;
import com.estate.entities.enums.PropertyStatus;
import com.estate.entities.enums.PropertyType;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyUpdateDTO {

    private String title;

    private String description;

    @DecimalMin(value = "0.0")
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
}