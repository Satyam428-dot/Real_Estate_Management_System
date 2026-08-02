package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.PropertyReviewRequestDTO;
import com.estate.dtos.PropertyReviewResponseDTO;
import com.estate.service.PropertyReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PropertyReviewController {

	private final PropertyReviewService reviewService;

	// 1. Submit a Review (Buyer)
	@PostMapping
	public ResponseEntity<PropertyReviewResponseDTO> createReview(@Valid @RequestBody PropertyReviewRequestDTO dto,
			Authentication authentication) {
		return new ResponseEntity<>(reviewService.createReview(dto, authentication.getName()), HttpStatus.CREATED);
	}

	// 2. Get All Reviews
	@GetMapping
	public ResponseEntity<List<PropertyReviewResponseDTO>> getAllReviews() {
		return ResponseEntity.ok(reviewService.getAllReviews());
	}

	// 3. Get Reviews for a Specific Property
	@GetMapping("/property/{propertyId}")
	public ResponseEntity<List<PropertyReviewResponseDTO>> getReviewsByProperty(@PathVariable Long propertyId) {
		return ResponseEntity.ok(reviewService.getReviewsByProperty(propertyId));
	}

	// 4. Get Reviews Submitted by Logged-in Buyer
	@GetMapping("/buyer")
	public ResponseEntity<List<PropertyReviewResponseDTO>> getBuyerReviews(Authentication authentication) {
		return ResponseEntity.ok(reviewService.getBuyerReviews(authentication.getName()));
	}
}
