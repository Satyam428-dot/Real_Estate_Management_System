package com.estate.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleVisitRequestDTO {

	@NotNull(message = "Property ID is required")
	private Long propertyId;

	@NotBlank(message = "Full name is required")
	private String fullName;

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Phone number is required")
	private String phone;

	@NotNull(message = "Visit date is required")
	@FutureOrPresent(message = "Visit date must be today or in the future")
	private LocalDate visitDate;

	@NotBlank(message = "Time slot is required")
	private String timeSlot;

	private String specificRequirements;
	private String messageToOwner;
}