package com.estate.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.customExceptions.UserNotFoundException;
import com.estate.dtos.PropertyReviewRequestDTO;
import com.estate.dtos.PropertyReviewResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.PropertyReview;
import com.estate.entities.User;
import com.estate.repository.PropertyRepository;
import com.estate.repository.PropertyReviewRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyReviewServiceImpl implements PropertyReviewService {

	private final PropertyReviewRepository reviewRepo;
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;

	@Override
	@Transactional
	public PropertyReviewResponseDTO createReview(PropertyReviewRequestDTO dto, String reviewerEmail) {
		User reviewer = userRepo.findByEmail(reviewerEmail)
				.orElseThrow(() -> new UserNotFoundException("Reviewer user not found with email: " + reviewerEmail));

		Property property = propertyRepo.findById(dto.getPropertyId())
				.orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + dto.getPropertyId()));

		PropertyReview review = PropertyReview.builder()
				.reviewer(reviewer)
				.property(property)
				.rating(dto.getRating())
				.comment(dto.getComment())
				.locationRating(dto.getLocationRating() != null ? dto.getLocationRating() : 4.5)
				.valueForMoneyRating(dto.getValueForMoneyRating() != null ? dto.getValueForMoneyRating() : 4.5)
				.amenitiesRating(dto.getAmenitiesRating() != null ? dto.getAmenitiesRating() : 4.5)
				.verifiedBuyer(true)
				.build();

		PropertyReview savedReview = reviewRepo.save(review);
		return mapToDTO(savedReview);
	}

	@Override
	public List<PropertyReviewResponseDTO> getAllReviews() {
		return reviewRepo.findAllByOrderByCreatedOnDesc()
				.stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<PropertyReviewResponseDTO> getReviewsByProperty(Long propertyId) {
		return reviewRepo.findByPropertyIdOrderByCreatedOnDesc(propertyId)
				.stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<PropertyReviewResponseDTO> getBuyerReviews(String reviewerEmail) {
		User reviewer = userRepo.findByEmail(reviewerEmail)
				.orElseThrow(() -> new UserNotFoundException("Reviewer user not found with email: " + reviewerEmail));

		return reviewRepo.findByReviewerIdOrderByCreatedOnDesc(reviewer.getId())
				.stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	private PropertyReviewResponseDTO mapToDTO(PropertyReview review) {
		String mainImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
		if (review.getProperty().getImages() != null && !review.getProperty().getImages().isEmpty()) {
			mainImage = review.getProperty().getImages().get(0).getImageUrl();
		}

		String reviewerName = review.getReviewer().getFirstName() + " " + review.getReviewer().getLastName();
		String avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80";

		return PropertyReviewResponseDTO.builder()
				.id(review.getId())
				.propertyId(review.getProperty().getId())
				.propertyTitle(review.getProperty().getTitle())
				.propertyLocation(review.getProperty().getAddress() + ", " + review.getProperty().getCity())
				.propertyCity(review.getProperty().getCity())
				.propertyImage(mainImage)
				.reviewerId(review.getReviewer().getId())
				.reviewerName(reviewerName)
				.reviewerRole("Verified Buyer")
				.reviewerAvatar(avatar)
				.rating(review.getRating())
				.reviewText(review.getComment())
				.locationRating(review.getLocationRating())
				.valueForMoneyRating(review.getValueForMoneyRating())
				.amenitiesRating(review.getAmenitiesRating())
				.verifiedBuyer(review.isVerifiedBuyer())
				.date(review.getCreatedOn())
				.build();
	}
}
