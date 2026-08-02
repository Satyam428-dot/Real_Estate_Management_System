package com.estate.dtos;

import java.time.LocalDate;

import com.estate.entities.enums.VisitStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitResponseDTO {

	private Long id;

	// Property Information
	private Long propertyId;
	private String propertyTitle;
	private String propertyLocation;
	private String propertyCity;
	private String propertyImage;

	// Buyer & Owner Info
	private Long buyerId;
	private String buyerName;
	private Long ownerId;
	private String ownerName;

	// Visit Details
	private String fullName;
	private String email;
	private String phone;
	private LocalDate visitDate;
	private String timeSlot;
	private String specificRequirements;
	private String messageToOwner;
	private VisitStatus status;
	private LocalDate createdOn;
}