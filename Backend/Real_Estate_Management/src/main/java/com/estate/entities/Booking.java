package com.estate.entities;

import java.time.LocalDate;

import com.estate.entities.enums.BookingStatus;
import com.estate.entities.enums.BookingType;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@AttributeOverride(name = "id", column = @Column(name = "booking_id"))
public class Booking extends BaseClass {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buyer_id", nullable = false)
	private User buyer;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "property_id", nullable = false)
	private Property property;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = true)
	private User owner;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String phone;

	@Column(name = "booking_date", nullable = false)
	private LocalDate bookingDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "booking_type", nullable = false)
	private BookingType bookingType;

	@Column(name = "token_amount", nullable = false)
	private Double tokenAmount;

	@Column(name = "message_to_owner", length = 1000)
	private String messageToOwner;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private BookingStatus status = BookingStatus.PENDING;
}
