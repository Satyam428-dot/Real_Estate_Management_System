package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.estate.entities.PropertyReview;

@Repository
public interface PropertyReviewRepository extends JpaRepository<PropertyReview, Long> {

	List<PropertyReview> findByPropertyIdOrderByCreatedOnDesc(Long propertyId);

	List<PropertyReview> findByReviewerIdOrderByCreatedOnDesc(Long reviewerId);

	List<PropertyReview> findAllByOrderByCreatedOnDesc();

	@Query("SELECT AVG(r.rating) FROM PropertyReview r WHERE r.property.id = :propertyId")
	Double findAverageRatingByPropertyId(@Param("propertyId") Long propertyId);
}
