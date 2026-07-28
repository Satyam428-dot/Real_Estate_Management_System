package com.estate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
import java.util.Optional;

import com.estate.entities.Property;
import com.estate.entities.enums.PropertyStatus;


public interface PropertyRepository extends JpaRepository<Property,Long> {
	@EntityGraph(attributePaths = { "owner", "images" })
	List<Property> findAll();

	@EntityGraph(attributePaths = { "owner", "images" })
	List<Property> findByStatusAndBlacklistFalse(PropertyStatus status);

	@EntityGraph(attributePaths = { "owner", "images" })
	Optional<Property> findById(Long id);

	@EntityGraph(attributePaths = { "owner", "images" })
	List<Property> findByOwnerId(Long ownerId);
}
