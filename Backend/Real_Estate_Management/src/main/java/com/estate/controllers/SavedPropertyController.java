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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.SavedPropertyResponseDTO;
import com.estate.service.SavedPropertyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favourites")
@RequiredArgsConstructor
public class SavedPropertyController {

	private final SavedPropertyService savedPropertyService;

	// -------------------- Save a Property --------------------
	@PostMapping("/{propertyId}")
	public ResponseEntity<?> saveProperty(@PathVariable Long propertyId, Authentication authentication) {
		try {
			SavedPropertyResponseDTO saved = savedPropertyService.saveProperty(propertyId, authentication.getName());
			return new ResponseEntity<>(saved, HttpStatus.CREATED);
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	// -------------------- Unsave / Remove a Property --------------------
	@DeleteMapping("/{propertyId}")
	public ResponseEntity<?> unsaveProperty(@PathVariable Long propertyId, Authentication authentication) {
		try {
			savedPropertyService.unsaveProperty(propertyId, authentication.getName());
			return ResponseEntity.ok("Property removed from saved list");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// -------------------- Get All Saved Properties --------------------
	@GetMapping
	public ResponseEntity<List<SavedPropertyResponseDTO>> getSavedProperties(Authentication authentication) {
		return ResponseEntity.ok(savedPropertyService.getSavedProperties(authentication.getName()));
	}

	// -------------------- Check if Property is Saved --------------------
	@GetMapping("/{propertyId}/check")
	public ResponseEntity<Boolean> isPropertySaved(@PathVariable Long propertyId, Authentication authentication) {
		return ResponseEntity.ok(savedPropertyService.isPropertySaved(propertyId, authentication.getName()));
	}

	// -------------------- Get Saved Count --------------------
	@GetMapping("/count")
	public ResponseEntity<Long> getSavedCount(Authentication authentication) {
		return ResponseEntity.ok(savedPropertyService.getSavedCount(authentication.getName()));
	}
}
