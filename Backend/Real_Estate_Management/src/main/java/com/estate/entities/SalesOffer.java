package com.estate.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.estate.entities.enums.OfferStatus;

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
@Table(name = "sales_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@AttributeOverride(name = "id", column = @Column(name = "offer_id"))
public class SalesOffer extends BaseClass {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "offer_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal offerPrice;

    @Column(name = "counter_price", precision = 12, scale = 2)
    private BigDecimal counterPrice;

    @Column(name = "offer_date", nullable = false)
    private LocalDate offerDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_status", nullable = false)
    @Builder.Default
    private OfferStatus offerStatus = OfferStatus.PENDING;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}