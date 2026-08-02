package com.estate.service;

import java.util.List;

import com.estate.dtos.PropertyReviewRequestDTO;
import com.estate.dtos.PropertyReviewResponseDTO;

public interface PropertyReviewService {

	PropertyReviewResponseDTO createReview(PropertyReviewRequestDTO dto, String reviewerEmail);

	List<PropertyReviewResponseDTO> getAllReviews();

	List<PropertyReviewResponseDTO> getReviewsByProperty(Long propertyId);

	List<PropertyReviewResponseDTO> getBuyerReviews(String reviewerEmail);
}
