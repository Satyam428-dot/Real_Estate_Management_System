package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.LeaseRequestDTO;
import com.estate.dtos.LeaseResponseDTO;
import com.estate.service.LeaseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/leases")
@RequiredArgsConstructor
public class LeaseController { 
	
	private final LeaseService leaseService;
	
	@PostMapping
	public ResponseEntity<LeaseResponseDTO> createLease(@RequestBody
			LeaseRequestDTO dto){
		return new ResponseEntity<>(leaseService.createLease(dto),HttpStatus.CREATED);

	}
	
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity <List<LeaseResponseDTO>> getLeasesByOwner(@PathVariable Long ownerId){
		return ResponseEntity.ok(leaseService.getLeaseByOwner(ownerId));
	}
	
	@GetMapping("/tenant/{tenantId}")
	public ResponseEntity<List<LeaseResponseDTO>> getLeasesByTenant(@PathVariable Long tenantId){
		return ResponseEntity.ok(leaseService.getLeaseByTenant(tenantId));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<LeaseResponseDTO> getLeaseById(@PathVariable Long id){
		return ResponseEntity.ok(leaseService.getLeaseById(id));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> terminateLease(@PathVariable Long id){
		leaseService.terminateLease(id);
		return ResponseEntity.ok("Lease Terminated Sucessfully");
	}
}


























