package com.estate.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.estate.entities.FavouriteProperty;

public interface FavouritePropertyRepository extends JpaRepository<FavouriteProperty, Long> {
    List<FavouriteProperty> findByUserEmailOrderByCreatedOnDesc(String email);
    Optional<FavouriteProperty> findByUserEmailAndPropertyId(String email, Long propertyId);
}
