package com.estate.service;

import com.estate.dtos.PropertyRequestDTO;
import com.estate.entities.Property;


public interface PropertyService {

	Property addProperty(PropertyRequestDTO dto);
	
}
