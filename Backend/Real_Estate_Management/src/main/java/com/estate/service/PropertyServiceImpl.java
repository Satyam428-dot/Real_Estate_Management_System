package com.estate.service;

import java.util.List;


import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.User;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;
	private final ModelMapper mapper;
	
	
	@Override
    public Property addProperty(PropertyRequestDTO dto) {
		
		User owner = userRepo.findById(dto.getOwnerId())
	            .orElseThrow(() -> new RuntimeException("Owner not found"));
		
		
		Property propertyEntity = mapper.map(dto, Property.class);
		propertyEntity.setOwner(owner);
		
		Property newPropertyEntity = propertyRepo.save(propertyEntity);
		return newPropertyEntity;
    }


	@Override
	public List<PropertyResponseDTO> listAllProperty() {

	    List<Property> properties = propertyRepo.findAll();

	    return properties.stream()
	            .map(property -> mapper.map(property, PropertyResponseDTO.class))
	            .toList();
	}
	
	@Override
	public PropertyResponseDTO getProperty(Long id) {
		Property property = propertyRepo.findById(id)
				 .orElseThrow(() -> new RuntimeException("Property not found"));
		return mapper.map(property, PropertyResponseDTO.class);
		
	}

}
