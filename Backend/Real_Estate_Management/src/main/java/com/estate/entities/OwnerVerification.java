package com.estate.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString

@Entity
@Table(name = "owner_verification")
@AttributeOverride(name = "id", column = @Column(name = "verification_id"))
public class OwnerVerification extends BaseClass {
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = false, unique = true)
	private User owner;

	@Column(name = "government_id_proof", nullable = false, length = 512)
	private String governmentIdProof;

	@Column(name = "selfie_image", nullable = false, length = 512)
	private String selfieImage;

	@Column(name = "verification_datetime")
	@CreationTimestamp
	private LocalDateTime verificationDatetime;

	@Enumerated(EnumType.STRING)
	@Column(name = "verification_status", nullable = false, length = 20)
	private VerificationStatus verificationStatus = VerificationStatus.PENDING;
}
