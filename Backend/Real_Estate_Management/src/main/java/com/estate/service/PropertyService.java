package com.estate.service;

import java.util.List;

import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.PropertyUpdateDTO;
import com.estate.entities.Property;


public interface PropertyService {

    Property addProperty(PropertyRequestDTO dto);

    List<PropertyResponseDTO> listAllProperty();

	PropertyResponseDTO getProperty(Long id);

	PropertyResponseDTO updateProperty(Long id, PropertyUpdateDTO dto);

	void deleteProperty(Long id);

}