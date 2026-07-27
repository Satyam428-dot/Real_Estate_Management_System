package com.estate.service;

import java.util.List;


import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.PropertyUpdateDTO;
import com.estate.entities.Property;
import com.estate.entities.User;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;
	private final ModelMapper mapper;
	
	
	private PropertyResponseDTO convertToDTO(Property property) {
		PropertyResponseDTO dto = mapper.map(property, PropertyResponseDTO.class);
		
		// Map IDs and fields that ModelMapper STRICT strategy cannot match automatically
		dto.setPropertyId(property.getId());
		
		if (property.getCreatedOn() != null) {
			dto.setCreatedAt(property.getCreatedOn().atStartOfDay());
		}
		
		if (property.getOwner() != null) {
			dto.setOwnerId(property.getOwner().getId());
			dto.setOwnerName(property.getOwner().getFirstName() + " " + property.getOwner().getLastName());
		}
		
		return dto;
	}

	@Override
    public PropertyResponseDTO addProperty(PropertyRequestDTO dto) {
		User owner = userRepo.findById(dto.getOwnerId())
	            .orElseThrow(() -> new RuntimeException("Owner not found"));
		
		Property propertyEntity = mapper.map(dto, Property.class);
		propertyEntity.setOwner(owner);
		
		Property newPropertyEntity = propertyRepo.save(propertyEntity);
		return convertToDTO(newPropertyEntity);
    }

	@Override
	public List<PropertyResponseDTO> listAllProperty() {
	    List<Property> properties = propertyRepo.findAll();
	    return properties.stream()
	            .map(this::convertToDTO)
	            .toList();
	}
	
	@Override
	public PropertyResponseDTO getProperty(Long id) {
		Property property = propertyRepo.findById(id)
				 .orElseThrow(() -> new RuntimeException("Property not found"));
		return convertToDTO(property);
	}

	@Override
	public PropertyResponseDTO updateProperty(Long id, PropertyUpdateDTO dto) {
		Property property = propertyRepo.findById(id)
		        .orElseThrow(()-> new RuntimeException("Property not found"));
		
		mapper.map(dto, property);
		Property savedProperty = propertyRepo.save(property);
		
		return convertToDTO(savedProperty);
	}

	@Override
	public void deleteProperty(Long id) {
		Property property = propertyRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("Property not found"));
		propertyRepo.delete(property);
	}
}
