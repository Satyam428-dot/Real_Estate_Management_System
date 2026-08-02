package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.estate.entities.Booking;
import com.estate.entities.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByBuyerId(Long buyerId);

	List<Booking> findByOwnerId(Long ownerId);

	List<Booking> findByPropertyId(Long propertyId);

	List<Booking> findByBuyerIdAndStatus(Long buyerId, BookingStatus status);
}
