package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.estate.entities.PropertyVisit;

public interface PropertyVisitRepository extends JpaRepository<PropertyVisit, Long> {

	@Query("SELECT v FROM PropertyVisit v WHERE v.buyer.id = :buyerId ORDER BY v.visitDate DESC")
	List<PropertyVisit> findByBuyerId(@Param("buyerId") Long buyerId);

	@Query("SELECT v FROM PropertyVisit v WHERE v.owner.id = :ownerId ORDER BY v.visitDate DESC")
	List<PropertyVisit> findByOwnerId(@Param("ownerId") Long ownerId);

	List<PropertyVisit> findByPropertyId(Long propertyId);
}