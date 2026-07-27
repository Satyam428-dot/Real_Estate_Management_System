package com.estate.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.PropertyResponseDTO;
import com.estate.entities.FavouriteProperty;
import com.estate.entities.User;
import com.estate.repository.FavouritePropertyRepository;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;
import com.estate.service.PropertyService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favourites")
@RequiredArgsConstructor
public class FavouriteController {
    private final FavouritePropertyRepository favourites;
    private final UserRepository users;
    private final PropertyRepository properties;
    private final PropertyService propertyService;

    @GetMapping
    public List<PropertyResponseDTO> list(Authentication auth) {
        return favourites.findByUserEmailOrderByCreatedOnDesc(auth.getName()).stream()
                .map(item -> propertyService.getProperty(item.getProperty().getId())).toList();
    }
    @GetMapping("/ids")
    public List<Long> ids(Authentication auth) {
        return favourites.findByUserEmailOrderByCreatedOnDesc(auth.getName()).stream()
                .map(item -> item.getProperty().getId()).toList();
    }
    @PostMapping("/{propertyId}")
    public ResponseEntity<Void> save(@PathVariable Long propertyId, Authentication auth) {
        if (favourites.findByUserEmailAndPropertyId(auth.getName(), propertyId).isPresent()) return ResponseEntity.ok().build();
        User user = users.findByEmail(auth.getName()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        FavouriteProperty favourite = new FavouriteProperty();
        favourite.setUser(user);
        favourite.setProperty(properties.findById(propertyId).orElseThrow(() -> new ResourceNotFoundException("Property not found")));
        favourites.save(favourite);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> remove(@PathVariable Long propertyId, Authentication auth) {
        favourites.delete(favourites.findByUserEmailAndPropertyId(auth.getName(), propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Favourite not found")));
        return ResponseEntity.noContent().build();
    }
}
