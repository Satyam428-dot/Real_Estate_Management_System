package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.PropertyUpdateDTO;
import com.estate.entities.Property;
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
	public ResponseEntity<Property> addProperty(@RequestBody PropertyRequestDTO dto){
		return new ResponseEntity<>(propertyService.addProperty(dto),HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<PropertyResponseDTO>> getAllProperty() {

	    return ResponseEntity.ok(propertyService.listAllProperty());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<PropertyResponseDTO> getPropertyById(@PathVariable Long id){
		return ResponseEntity.ok(propertyService.getProperty(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<PropertyResponseDTO> updateProperty(@PathVariable Long id,@RequestBody PropertyUpdateDTO dto){
		return ResponseEntity.ok(propertyService.updateProperty(id,dto));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProperty(@PathVariable Long id){
		propertyService.deleteProperty(id);
		return ResponseEntity.ok("property deleted sucessfully");
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
