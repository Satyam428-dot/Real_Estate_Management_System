package com.estate.service;

import java.math.BigDecimal;
import java.util.List;


import com.estate.dtos.SalesOfferRequestDTO;
import com.estate.dtos.SalesOfferResponseDTO;

public interface SalesOfferService {

	SalesOfferResponseDTO createOffer(SalesOfferRequestDTO dto);

	List<SalesOfferResponseDTO> getOfferByOwner(Long ownerId);

	List<SalesOfferResponseDTO> getOfferByBuyer(Long buyerId);

	SalesOfferResponseDTO getOfferById(Long id);

	SalesOfferResponseDTO updateOfferStatus(Long id, String status, BigDecimal counterPrice);

}
