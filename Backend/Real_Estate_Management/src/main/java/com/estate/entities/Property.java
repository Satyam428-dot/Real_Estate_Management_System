package com.estate.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.UpdateTimestamp;

import com.estate.entities.enums.ListingType;
import com.estate.entities.enums.PropertyStatus;
import com.estate.entities.enums.PropertyType;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@AttributeOverride(name = "id", column = @Column(name = "property_id"))

public class Property extends BaseClass {

	@OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<PropertyImage> images = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User owner;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal price;

	@Enumerated(EnumType.STRING)
	@Column(name = "property_type", nullable = false)
	private PropertyType propertyType;

	@Enumerated(EnumType.STRING)
	@Column(name = "listing_type", nullable = false)
	private ListingType listingType;

	@Column(nullable = false)
	private String address;

	@Column(nullable = false)
	private String city;

	@Column(nullable = false)
	private String state;

	@Column(name = "pin_code", nullable = false)
	private String pinCode;

	private Integer bedrooms;

	private Integer bathrooms;

	private Integer halls;

	@Column(name = "area_sqft")
	private Integer areaSqft;

	@Column(columnDefinition = "TEXT")
	private String amenities;

	@Column(columnDefinition = "TEXT")
	private String highlights;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PropertyStatus status = PropertyStatus.AVAILABLE;

	@Builder.Default
	@Column(nullable = false)
	private Boolean blacklist = false;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "verification_status", nullable = false)
	private VerificationStatus verificationStatus = VerificationStatus.PENDING;

	@Column(name = "title_deed_url")
	private String titleDeedUrl;

	@Column(name = "tax_receipt_url")
	private String taxReceiptUrl;

	@Column(name = "noc_certificate_url")
	private String nocCertificateUrl;

	@Column(name = "rejection_reason", columnDefinition = "TEXT")
	private String rejectionReason;

	@Column(name = "updated_at")
	@UpdateTimestamp
	private LocalDateTime updatedAt;

}
