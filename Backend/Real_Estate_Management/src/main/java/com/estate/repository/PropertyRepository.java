package com.estate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.Property;


public interface PropertyRepository extends JpaRepository<Property,Long> {
	
}
