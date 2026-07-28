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

import com.estate.dtos.MaintenanceRequestDTO;
import com.estate.dtos.MaintenanceResponseDTO;
import com.estate.service.MaintenanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/maintenance")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<MaintenanceResponseDTO> createRequest(@RequestBody MaintenanceRequestDTO dto) {
        return new ResponseEntity<>(maintenanceService.createRequest(dto), HttpStatus.CREATED);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<MaintenanceResponseDTO>> getRequestsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(maintenanceService.getRequestsByOwner(ownerId));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<MaintenanceResponseDTO>> getRequestsByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(maintenanceService.getRequestsByTenant(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceResponseDTO> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getRequestById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceResponseDTO> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        String status = (String) body.get("status");
        Double estimatedCost = body.get("estimatedCost") != null ? Double.valueOf(body.get("estimatedCost").toString()) : null;
        return ResponseEntity.ok(maintenanceService.updateRequestStatus(id, status, estimatedCost));
    }
}
