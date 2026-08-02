package com.estate.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.estate.entities.enums.BookingStatus;
import com.estate.entities.enums.BookingType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

	private Long bookingId;
	private String bookingCode; // e.g. BK-240520-001 or BK-1

	// Property Info
	private Long propertyId;
	private String propertyTitle;
	private String propertyLocation;
	private String propertyImage;
	private Integer beds;
	private Integer baths;
	private Integer sqft;
	private BigDecimal propertyPrice;

	// Buyer & Booking Details
	private Long buyerId;
	private Long ownerId;
	private String fullName;
	private String email;
	private String phone;
	private LocalDate bookedOn;
	private LocalDate bookingDate;
	private BookingType bookingType;
	private Double tokenAmount;
	private String formattedAmount; // e.g. "₹ 50,000"
	private String messageToOwner;
	private BookingStatus status;
}
