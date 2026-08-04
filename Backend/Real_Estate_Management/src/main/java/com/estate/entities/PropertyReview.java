package com.estate.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "property_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyReview extends BaseClass {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reviewer_id", nullable = false)
	private User reviewer;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "property_id", nullable = false)
	private Property property;

	@Column(nullable = false)
	private double rating;

	@Column(nullable = false, length = 1000)
	private String comment;

	@Column(name = "location_rating")
	@Builder.Default
	private double locationRating = 4.5;

	@Column(name = "value_rating")
	@Builder.Default
	private double valueForMoneyRating = 4.5;

	@Column(name = "amenities_rating")
	@Builder.Default
	private double amenitiesRating = 4.5;

	@Column(name = "verified_buyer")
	@Builder.Default
	private boolean verifiedBuyer = true;
}
