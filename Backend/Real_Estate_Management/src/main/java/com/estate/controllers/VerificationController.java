package com.estate.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.estate.dtos.PendingOwnerVerificationDto;
import com.estate.entities.OwnerVerification;
import com.estate.entities.VerificationStatus;
import com.estate.service.VerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/verify")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VerificationController {
	private final VerificationService verificationService;

//----------------------owner verification----------------------------
	@GetMapping("/owners")
	public ResponseEntity<?> getAllPendingOwnerRequests() {
		try {
			List<PendingOwnerVerificationDto> pendingVerifications = verificationService.getAllPendingOwnerRequests();
			return ResponseEntity.ok(pendingVerifications);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// --------------------update owner verification status------------
	@PutMapping("/owners/status/{verificationId}")
	public ResponseEntity<?> updateOwnerVerificationStatus(@PathVariable Long verificationId,
			@RequestBody Map<String, String> requestBody) {
		try {
			String statusStr = requestBody.get("status");
			if (statusStr == null) {
				return ResponseEntity.badRequest().body("Missing 'status' property in request body.");
			}

			VerificationStatus status = VerificationStatus.valueOf(statusStr.toUpperCase());

			String message = verificationService.updateOwnerVerificationStatus(verificationId, status);
			return ResponseEntity.ok(message);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// --------------------get owner verification status by ownerId------------
	@GetMapping({"/owner/{ownerId}/status", "/owners/{ownerId}/status"})
	public ResponseEntity<?> getOwnerVerificationStatus(@PathVariable Long ownerId) {
		try {
			VerificationStatus status = verificationService.getOwnerVerificationStatus(ownerId);
			String statusString = (status != null) ? status.name() : "NOT_SUBMITTED";
			Map<String, Object> map = new HashMap<>();
			map.put("ownerId", ownerId);
			map.put("verificationStatus", statusString);
			map.put("verification_status", statusString);
			return ResponseEntity.ok(map);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
		}
	}

	// --------------------submit owner verification documents------------
	@PostMapping(value = {"/owner/{ownerId}", "/owners/{ownerId}"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> submitOwnerVerification(
			@PathVariable Long ownerId,
			@RequestParam("governmentIdProof") MultipartFile governmentIdProof,
			@RequestParam("selfieImage") MultipartFile selfieImage) {
		try {
			OwnerVerification result = verificationService.submitOwnerVerification(ownerId, governmentIdProof, selfieImage);
			Map<String, Object> map = new HashMap<>();
			map.put("message", "Verification documents submitted successfully!");
			map.put("verificationId", result.getId());
			map.put("verificationStatus", result.getVerificationStatus() != null ? result.getVerificationStatus().name() : "PENDING");
			map.put("governmentIdProof", result.getGovernmentIdProof() != null ? result.getGovernmentIdProof() : "");
			map.put("selfieImage", result.getSelfieImage() != null ? result.getSelfieImage() : "");
			return ResponseEntity.ok(map);
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
		}
	}

	// --------------------get owner verification details by ownerId------------
	@GetMapping({"/owner/{ownerId}/details", "/owners/{ownerId}/details"})
	public ResponseEntity<?> getOwnerVerificationDetails(@PathVariable Long ownerId) {
		try {
			OwnerVerification result = verificationService.getOwnerVerificationByOwnerId(ownerId);
			Map<String, Object> map = new HashMap<>();
			map.put("ownerId", ownerId);
			if (result == null) {
				map.put("verificationStatus", "NOT_SUBMITTED");
			} else {
				map.put("verificationId", result.getId());
				map.put("governmentIdProof", result.getGovernmentIdProof() != null ? result.getGovernmentIdProof() : "");
				map.put("selfieImage", result.getSelfieImage() != null ? result.getSelfieImage() : "");
				map.put("verificationStatus", result.getVerificationStatus() != null ? result.getVerificationStatus().name() : "NOT_SUBMITTED");
				map.put("verificationDatetime", result.getVerificationDatetime() != null ? result.getVerificationDatetime().toString() : "");
			}
			return ResponseEntity.ok(map);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
		}
	}
}
