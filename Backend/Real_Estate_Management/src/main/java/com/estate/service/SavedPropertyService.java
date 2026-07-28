package com.estate.service;

import java.util.List;

import com.estate.dtos.SavedPropertyResponseDTO;

public interface SavedPropertyService {

	SavedPropertyResponseDTO saveProperty(Long propertyId, String buyerEmail);

	void unsaveProperty(Long propertyId, String buyerEmail);

	List<SavedPropertyResponseDTO> getSavedProperties(String buyerEmail);

	boolean isPropertySaved(Long propertyId, String buyerEmail);

	long getSavedCount(String buyerEmail);
}
