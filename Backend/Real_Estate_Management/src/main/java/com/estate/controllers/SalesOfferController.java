package com.estate.controllers;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.SalesOfferRequestDTO;
import com.estate.dtos.SalesOfferResponseDTO;
import com.estate.service.SalesOfferService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sales-offers")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SalesOfferController {
	
	private final SalesOfferService salesOfferService;
	
	@PostMapping
	public ResponseEntity<SalesOfferResponseDTO> createOffer(@RequestBody SalesOfferRequestDTO dto){
		return new ResponseEntity<>(salesOfferService.createOffer(dto),HttpStatus.CREATED);
	}
	
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<SalesOfferResponseDTO>> getOfferByOwner(@PathVariable Long ownerId){
		return ResponseEntity.ok(salesOfferService.getOfferByOwner(ownerId));
	}
	
	@GetMapping("/buyer/{buyerId}")
	public ResponseEntity<List<SalesOfferResponseDTO>> getOfferByBuyer(@PathVariable Long buyerId){
		return ResponseEntity.ok(salesOfferService.getOfferByBuyer(buyerId));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<SalesOfferResponseDTO> getOfferById(@PathVariable Long id){
		return ResponseEntity.ok(salesOfferService.getOfferById(id));
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<SalesOfferResponseDTO> updateOfferStatus(@PathVariable Long id,
			@RequestBody Map<String,Object> body){
		String status = (String) body.get("status");
		BigDecimal counterPrice = body.get("counterPrice") != null ? new BigDecimal(body.get("counterPrice").toString())
				: null;
		return ResponseEntity.ok(salesOfferService.updateOfferStatus(id,status,counterPrice));
		
	}
	
}
