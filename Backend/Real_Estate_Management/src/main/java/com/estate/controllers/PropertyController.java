package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.PropertyUpdateDTO;
import com.estate.service.PropertyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/properties")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PropertyController {
	private final PropertyService propertyService;
	
	//----------------------------Create Property--------------------------------------------//
	@PostMapping
	public ResponseEntity<PropertyResponseDTO> addProperty(@Valid @RequestBody PropertyRequestDTO dto,
			Authentication authentication){
		return new ResponseEntity<>(propertyService.addProperty(dto, authentication.getName()),HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<PropertyResponseDTO>> getAllProperty() {

	    return ResponseEntity.ok(propertyService.listAllProperty());
	}

	@GetMapping("/available")
	public ResponseEntity<List<PropertyResponseDTO>> getAvailableProperties() {
		return ResponseEntity.ok(propertyService.listAvailableProperties());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<PropertyResponseDTO> getPropertyById(@PathVariable Long id){
		return ResponseEntity.ok(propertyService.getProperty(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<PropertyResponseDTO> updateProperty(@PathVariable Long id,@Valid @RequestBody PropertyUpdateDTO dto){
		return ResponseEntity.ok(propertyService.updateProperty(id,dto));
	}

	@PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PropertyResponseDTO> uploadImages(@PathVariable Long id,
			@RequestParam("images") List<MultipartFile> images, Authentication authentication) {
		return ResponseEntity.ok(propertyService.uploadImages(id, images, authentication.getName()));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProperty(@PathVariable Long id){
		propertyService.deleteProperty(id);
		return ResponseEntity.ok("property deleted sucessfully");
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
