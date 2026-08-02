package com.estate.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class PropertyReviewRequestDTO {

	@NotNull(message = "Property ID is required")
	private Long propertyId;

	@NotNull(message = "Rating score is required")
	@Min(value = 1, message = "Rating must be at least 1")
	@Max(value = 5, message = "Rating cannot exceed 5")
	private Double rating;

	@NotBlank(message = "Review comment is required")
	private String comment;

	private Double locationRating;
	private Double valueForMoneyRating;
	private Double amenitiesRating;
}
