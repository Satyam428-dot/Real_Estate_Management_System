package com.estate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

	@Modifying
	@Query(value = "DELETE FROM saved_properties WHERE property_id = :propertyId", nativeQuery = true)
	void deleteSavedPropertiesByPropertyId(@Param("propertyId") Long propertyId);

	@Modifying
	@Query(value = "DELETE FROM favourite_properties WHERE property_id = :propertyId", nativeQuery = true)
	void deleteFavouritePropertiesByPropertyId(@Param("propertyId") Long propertyId);

	@Modifying
	@Query(value = "DELETE FROM leases WHERE property_id = :propertyId", nativeQuery = true)
	void deleteLeasesByPropertyId(@Param("propertyId") Long propertyId);

	@Modifying
	@Query(value = "DELETE FROM maintenance_requests WHERE property_id = :propertyId", nativeQuery = true)
	void deleteMaintenanceRequestsByPropertyId(@Param("propertyId") Long propertyId);

	@Modifying
	@Query(value = "DELETE FROM sales_offers WHERE property_id = :propertyId", nativeQuery = true)
	void deleteSalesOffersByPropertyId(@Param("propertyId") Long propertyId);
}
