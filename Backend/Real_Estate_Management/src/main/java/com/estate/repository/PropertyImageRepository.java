package com.estate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.PropertyImage;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {

}
