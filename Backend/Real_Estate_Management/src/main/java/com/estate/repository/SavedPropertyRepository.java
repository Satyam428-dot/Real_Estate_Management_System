package com.estate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.SavedProperty;

public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {

	@EntityGraph(attributePaths = { "property", "property.owner", "property.images" })
	List<SavedProperty> findByBuyerId(Long buyerId);

	boolean existsByBuyerIdAndPropertyId(Long buyerId, Long propertyId);

	Optional<SavedProperty> findByBuyerIdAndPropertyId(Long buyerId, Long propertyId);

	void deleteByBuyerIdAndPropertyId(Long buyerId, Long propertyId);

	long countByBuyerId(Long buyerId);
}
