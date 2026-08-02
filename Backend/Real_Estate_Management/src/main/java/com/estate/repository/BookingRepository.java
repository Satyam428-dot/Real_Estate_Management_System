package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.estate.entities.Booking;
import com.estate.entities.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	@EntityGraph(attributePaths = { "property", "property.images", "buyer", "owner" })
	List<Booking> findByBuyerId(Long buyerId);

	@EntityGraph(attributePaths = { "property", "property.images", "buyer", "owner" })
	List<Booking> findByOwnerId(Long ownerId);

	@EntityGraph(attributePaths = { "property", "property.images", "buyer", "owner" })
	List<Booking> findByPropertyId(Long propertyId);

	List<Booking> findByBuyerIdAndStatus(Long buyerId, BookingStatus status);
}
