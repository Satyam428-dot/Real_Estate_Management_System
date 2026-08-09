package com.estate.controllers;

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

import com.estate.dtos.RentPaymentRequestDTO;
import com.estate.dtos.RentPaymentResponseDTO;
import com.estate.service.RentPaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class RentPaymentController {

	private final RentPaymentService paymentService;
	
	@PostMapping
	public ResponseEntity<RentPaymentResponseDTO> createPayment(@RequestBody RentPaymentRequestDTO dto) {
		return new ResponseEntity<>(paymentService.createPayment(dto), HttpStatus.CREATED);
	}
	
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<RentPaymentResponseDTO>> getPaymentsByOwner(@PathVariable Long ownerId) {
		return ResponseEntity.ok(paymentService.getPaymentsByOwner(ownerId));
	}
	
	@GetMapping("/tenant/{tenantId}")
	public ResponseEntity<List<RentPaymentResponseDTO>> getPaymentsByTenant(@PathVariable Long tenantId) {
		return ResponseEntity.ok(paymentService.getPaymentsByTenant(tenantId));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<RentPaymentResponseDTO> getPaymentById(@PathVariable Long id) {
		return ResponseEntity.ok(paymentService.getPaymentById(id));
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<RentPaymentResponseDTO> updatePaymentStatus(
			@PathVariable Long id,
			@RequestBody Map<String, String> body) {
		String status = body.get("status");
		String transactionId = body.get("transactionId");
		return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status, transactionId));
	}
}