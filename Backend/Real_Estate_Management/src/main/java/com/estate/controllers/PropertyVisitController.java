package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.ScheduleVisitRequestDTO;
import com.estate.dtos.VisitResponseDTO;
import com.estate.dtos.VisitStatusUpdateDTO;
import com.estate.service.PropertyVisitService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/visits")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PropertyVisitController {

	private final PropertyVisitService visitService;

	// 1. Schedule a Visit (Buyer)
	@PostMapping
	public ResponseEntity<VisitResponseDTO> scheduleVisit(@Valid @RequestBody ScheduleVisitRequestDTO dto,
			Authentication authentication) {
		return new ResponseEntity<>(visitService.scheduleVisit(dto, authentication.getName()), HttpStatus.CREATED);
	}

	// 2. Get Buyer's Scheduled Visits
	@GetMapping("/buyer")
	public ResponseEntity<List<VisitResponseDTO>> getBuyerVisits(Authentication authentication) {
		return ResponseEntity.ok(visitService.getBuyerVisits(authentication.getName()));
	}

	// 3. Get Owner's Incoming Visit Requests
	@GetMapping("/owner")
	public ResponseEntity<List<VisitResponseDTO>> getOwnerVisits(Authentication authentication) {
		return ResponseEntity.ok(visitService.getOwnerVisits(authentication.getName()));
	}

	// 4. Update Visit Status (Owner / Admin)
	@PutMapping("/{id}/status")
	public ResponseEntity<VisitResponseDTO> updateVisitStatus(@PathVariable Long id,
			@Valid @RequestBody VisitStatusUpdateDTO dto, Authentication authentication) {
		return ResponseEntity.ok(visitService.updateVisitStatus(id, dto.getStatus(), authentication.getName()));
	}

	// 5. Cancel a Scheduled Visit (Buyer / Owner)
	@DeleteMapping("/{id}")
	public ResponseEntity<String> cancelVisit(@PathVariable Long id, Authentication authentication) {
		visitService.cancelVisit(id, authentication.getName());
		return ResponseEntity.ok("Visit scheduled with ID " + id + " has been cancelled.");
	}
}