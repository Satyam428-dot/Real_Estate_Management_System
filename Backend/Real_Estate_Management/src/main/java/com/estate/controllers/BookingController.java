package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.BookingRequestDTO;
import com.estate.dtos.BookingResponseDTO;
import com.estate.dtos.BookingStatusUpdateDTO;
import com.estate.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;

	// 1. Create a New Booking (Buyer)
	@PostMapping
	public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO dto,
			Authentication authentication) {
		return new ResponseEntity<>(bookingService.createBooking(dto, authentication.getName()), HttpStatus.CREATED);
	}

	// 2. Get Buyer's Bookings ("My Bookings")
	@GetMapping("/buyer")
	public ResponseEntity<List<BookingResponseDTO>> getBuyerBookings(Authentication authentication) {
		return ResponseEntity.ok(bookingService.getBuyerBookings(authentication.getName()));
	}

	// 3. Get Owner's Received Bookings
	@GetMapping("/owner")
	public ResponseEntity<List<BookingResponseDTO>> getOwnerBookings(Authentication authentication) {
		return ResponseEntity.ok(bookingService.getOwnerBookings(authentication.getName()));
	}

	// 4. Get Booking Details by ID
	@GetMapping("/{id}")
	public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
		return ResponseEntity.ok(bookingService.getBookingById(id));
	}

	// 5. Update Booking Status (Owner / Admin)
	@PutMapping("/{id}/status")
	public ResponseEntity<BookingResponseDTO> updateBookingStatus(@PathVariable Long id,
			@Valid @RequestBody BookingStatusUpdateDTO dto, Authentication authentication) {
		return ResponseEntity.ok(bookingService.updateBookingStatus(id, dto.getStatus(), authentication.getName()));
	}

	// 6. Cancel Booking (Buyer / Owner)
	@DeleteMapping("/{id}")
	public ResponseEntity<String> cancelBooking(@PathVariable Long id, Authentication authentication) {
		bookingService.cancelBooking(id, authentication.getName());
		return ResponseEntity.ok("Booking with ID " + id + " has been cancelled.");
	}
}
