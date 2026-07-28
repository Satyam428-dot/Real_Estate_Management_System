package com.estate.service;

import java.util.List;

import com.estate.dtos.PropertyRequestDTO;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.dtos.PropertyUpdateDTO;
import org.springframework.web.multipart.MultipartFile;


public interface PropertyService {

    PropertyResponseDTO addProperty(PropertyRequestDTO dto, String ownerEmail);

    List<PropertyResponseDTO> listAllProperty();

	PropertyResponseDTO getProperty(Long id);

	PropertyResponseDTO updateProperty(Long id, PropertyUpdateDTO dto);

	void deleteProperty(Long id);

	PropertyResponseDTO uploadImages(Long id, java.util.List<MultipartFile> images, String ownerEmail);

	List<PropertyResponseDTO> listAvailableProperties();

	List<PropertyResponseDTO> getPropertiesByOwnerId(Long ownerId);

}
