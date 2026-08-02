package com.estate.dtos;

import java.time.LocalDate;

import com.estate.entities.enums.BookingType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequestDTO {

	@NotNull(message = "Property ID is required")
	private Long propertyId;

	@NotBlank(message = "Full name is required")
	private String fullName;

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Phone number is required")
	private String phone;

	@NotNull(message = "Booking date is required")
	@FutureOrPresent(message = "Booking date must be today or in the future")
	private LocalDate bookingDate;

	@NotNull(message = "Booking type is required")
	private BookingType bookingType;

	@NotNull(message = "Token amount is required")
	@Positive(message = "Token amount must be greater than zero")
	private Double tokenAmount;

	private String messageToOwner;
}
