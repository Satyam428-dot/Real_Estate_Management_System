package com.estate.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.estate.dtos.PropertyRequestDTO;
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

}
