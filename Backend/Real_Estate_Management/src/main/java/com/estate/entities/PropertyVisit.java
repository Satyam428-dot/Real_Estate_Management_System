package com.estate.entities;

import java.time.LocalDate;

import com.estate.entities.enums.VisitStatus;

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
@Table(name = "property_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@AttributeOverride(name = "id", column = @Column(name = "visit_id"))
public class PropertyVisit extends BaseClass {

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

	@Column(name = "visit_date", nullable = false)
	private LocalDate visitDate;

	@Column(name = "time_slot")
	private String timeSlot;

	@Column(name = "visit_time")
	private String visitTime;

	@Column(name = "specific_requirements", length = 1000)
	private String specificRequirements;

	@Column(name = "message_to_owner", length = 1000)
	private String messageToOwner;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	@Builder.Default
	private VisitStatus status = VisitStatus.PENDING;
}