package com.estate.service;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.dtos.SalesOfferRequestDTO;
import com.estate.dtos.SalesOfferResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.SalesOffer;
import com.estate.entities.User;
import com.estate.entities.enums.OfferStatus;
import com.estate.repository.PropertyRepository;
import com.estate.repository.SalesOfferRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class SalesOfferServiceImpl implements SalesOfferService{

	private final SalesOfferRepository offerRepo;
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;
	private final ModelMapper mapper;
	
	private SalesOfferResponseDTO converToDto(SalesOffer offer) {
		SalesOfferResponseDTO dto = mapper.map(offer, SalesOfferResponseDTO.class);
		dto.setOfferId(offer.getId());
		
		if(offer.getProperty() != null) {
			dto.setPropertyId(offer.getProperty().getId());
			dto.setPropertyTitle(offer.getProperty().getTitle());
			dto.setPropertyPrice(offer.getProperty().getPrice());
		}
		
		if(offer.getBuyer() != null) {
			dto.setBuyerId(offer.getBuyer().getId());
			dto.setBuyerName(offer.getBuyer().getFirstName() + " " + offer.getBuyer().getLastName());
			dto.setBuyerEmail(offer.getBuyer().getEmail());
			dto.setBuyerPhone(offer.getBuyer().getPhone());
		}
		
		if(offer.getOwner() != null) {
			dto.setOwnerId(offer.getOwner().getId());
		}
		
		return dto;
	}
	
	@Override
	public SalesOfferResponseDTO createOffer(SalesOfferRequestDTO dto) {
		Property property = propertyRepo.findById(dto.getPropertyId())
				.orElseThrow(()-> new RuntimeException("Property not found"));
		
		User buyer = userRepo.findById(dto.getBuyerId())
				.orElseThrow(()-> new RuntimeException("Buyer not found"));
		
		User owner = userRepo.findById(dto.getOwnerId())
				.orElseThrow(()-> new RuntimeException("Owner not found"));
		
		SalesOffer offer = SalesOffer.builder()
				.property(property)
				.buyer(buyer)
				.owner(owner)
				.offerPrice(dto.getOfferPrice())
				.counterPrice(dto.getCounterPrice())
				.offerDate(LocalDate.now())
				.offerStatus(dto.getOfferStatus() != null ? dto.getOfferStatus() : OfferStatus.PENDING)
				.notes(dto.getNotes())
				.build();
		
		SalesOffer saved = offerRepo.save(offer);
		return converToDto(saved);
		
	}

	@Override
	public List<SalesOfferResponseDTO> getOfferByOwner(Long ownerId) {
		List<SalesOffer> offer = offerRepo.findByOwnerId(ownerId);
		return offer.stream().map(this::converToDto).toList();
	}

	@Override
	public List<SalesOfferResponseDTO> getOfferByBuyer(Long buyerId) {
		List<SalesOffer> offer = offerRepo.findByBuyerId(buyerId);
		return offer.stream().map(this::converToDto).toList();
	}

	@Override
	public SalesOfferResponseDTO getOfferById(Long id) {
		SalesOffer offer = offerRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("Sale Offer not found"));
		return converToDto(offer);	
	}

	@Override
	public SalesOfferResponseDTO updateOfferStatus(Long offerId, String status, BigDecimal counterPrice) {
		SalesOffer offer = offerRepo.findById(offerId)
				 .orElseThrow(() -> new RuntimeException("Sales offer not found"));
		
		OfferStatus newStatus = OfferStatus.valueOf(status.toUpperCase());
		offer.setOfferStatus(newStatus);
		
		if(counterPrice  != null) {
			offer.setCounterPrice(counterPrice);
		}
		
		SalesOffer saved = offerRepo.save(offer);
		return converToDto(saved);
		
	}

}
