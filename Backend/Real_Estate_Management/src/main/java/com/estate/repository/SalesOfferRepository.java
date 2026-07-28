package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.estate.entities.SalesOffer;

public interface SalesOfferRepository extends JpaRepository<SalesOffer,Long> {

	List<SalesOffer> findByOwnerId(Long ownerId);

	List<SalesOffer> findByBuyerId(Long buyerId);

}
