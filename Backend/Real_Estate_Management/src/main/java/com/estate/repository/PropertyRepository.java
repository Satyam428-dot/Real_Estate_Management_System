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
	@Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.images")
	List<Property> findAll();

	@Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.images WHERE p.status = :status AND p.blacklist = false")
	List<Property> findByStatusAndBlacklistFalse(@Param("status") PropertyStatus status);

	@Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.images WHERE p.verificationStatus = :status")
	List<Property> findByVerificationStatus(@Param("status") com.estate.entities.VerificationStatus status);

	@Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.images WHERE p.status = :status AND p.verificationStatus = :verificationStatus AND p.blacklist = false")
	List<Property> findByStatusAndVerificationStatusAndBlacklistFalse(@Param("status") PropertyStatus status, @Param("verificationStatus") com.estate.entities.VerificationStatus verificationStatus);

	@Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.images WHERE p.id = :id")
	Optional<Property> findById(@Param("id") Long id);

	@Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.images WHERE p.owner.id = :ownerId")
	List<Property> findByOwnerId(@Param("ownerId") Long ownerId);

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
