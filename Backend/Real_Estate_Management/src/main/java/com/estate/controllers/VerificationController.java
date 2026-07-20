package com.estate.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.PendingOwnerVerificationDto;
import com.estate.entities.VerificationStatus;
import com.estate.service.VerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/verify")
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
}
