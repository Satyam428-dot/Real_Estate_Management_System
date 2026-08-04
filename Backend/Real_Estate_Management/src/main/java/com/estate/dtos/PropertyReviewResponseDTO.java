package com.estate.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyReviewResponseDTO {

	private Long id;
	private Long propertyId;
	private String propertyTitle;
	private String propertyLocation;
	private String propertyCity;
	private String propertyImage;
	private Long reviewerId;
	private String reviewerName;
	private String reviewerRole;
	private String reviewerAvatar;
	private double rating;
	private String reviewText;
	private double locationRating;
	private double valueForMoneyRating;
	private double amenitiesRating;
	private boolean verifiedBuyer;
	private LocalDate date;
}
