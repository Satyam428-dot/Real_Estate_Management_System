package com.estate.service;

import java.util.List;

import com.estate.dtos.BookingRequestDTO;
import com.estate.dtos.BookingResponseDTO;
import com.estate.entities.enums.BookingStatus;

public interface BookingService {

	BookingResponseDTO createBooking(BookingRequestDTO dto, String buyerEmail);

	List<BookingResponseDTO> getBuyerBookings(String buyerEmail);

	List<BookingResponseDTO> getOwnerBookings(String ownerEmail);

	BookingResponseDTO getBookingById(Long bookingId);

	BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status, String userEmail);

	void cancelBooking(Long bookingId, String userEmail);
}
