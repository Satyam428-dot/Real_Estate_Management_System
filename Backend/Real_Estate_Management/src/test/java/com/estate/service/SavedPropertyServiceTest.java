package com.estate.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.SavedPropertyResponseDTO;
import com.estate.entities.Property;
import com.estate.entities.SavedProperty;
import com.estate.entities.User;
import com.estate.entities.UserRole;
import com.estate.entities.enums.ListingType;
import com.estate.entities.enums.PropertyStatus;
import com.estate.repository.PropertyRepository;
import com.estate.repository.SavedPropertyRepository;
import com.estate.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class SavedPropertyServiceTest {

	@Mock
	private SavedPropertyRepository savedPropertyRepo;

	@Mock
	private PropertyRepository propertyRepo;

	@Mock
	private UserRepository userRepo;

	@InjectMocks
	private SavedPropertyServiceImpl savedPropertyService;

	private User buyer;
	private User owner;
	private Property property;
	private SavedProperty savedProperty;

	@BeforeEach
	void setUp() {
		buyer = new User();
		buyer.setId(1L);
		buyer.setEmail("buyer@example.com");
		buyer.setFirstName("John");
		buyer.setLastName("Doe");
		buyer.setUserRoles(UserRole.CUSTOMER);

		owner = new User();
		owner.setId(2L);
		owner.setEmail("owner@example.com");
		owner.setFirstName("Jane");
		owner.setLastName("Smith");
		owner.setUserRoles(UserRole.OWNER);

		property = new Property();
		property.setId(100L);
		property.setOwner(owner);
		property.setTitle("Luxury Villa");
		property.setDescription("Beautiful villa");
		property.setPrice(BigDecimal.valueOf(5000000.0));
		property.setListingType(ListingType.SALE);
		property.setAddress("123 Main St");
		property.setCity("Pune");
		property.setState("Maharashtra");
		property.setBedrooms(3);
		property.setBathrooms(3);
		property.setAreaSqft(2000);
		property.setStatus(PropertyStatus.AVAILABLE);
		property.setImages(new ArrayList<>());

		savedProperty = SavedProperty.builder()
				.buyer(buyer)
				.property(property)
				.build();
		savedProperty.setId(10L);
	}

	@Test
	void testSaveProperty_Success() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(propertyRepo.findById(100L)).thenReturn(Optional.of(property));
		when(savedPropertyRepo.existsByBuyerIdAndPropertyId(1L, 100L)).thenReturn(false);
		when(savedPropertyRepo.save(any(SavedProperty.class))).thenReturn(savedProperty);

		SavedPropertyResponseDTO response = savedPropertyService.saveProperty(100L, "buyer@example.com");

		assertNotNull(response);
		assertEquals(10L, response.getSavedId());
		assertEquals("Luxury Villa", response.getProperty().getTitle());
		verify(savedPropertyRepo, times(1)).save(any(SavedProperty.class));
	}

	@Test
	void testSaveProperty_AlreadySaved_ThrowsException() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(propertyRepo.findById(100L)).thenReturn(Optional.of(property));
		when(savedPropertyRepo.existsByBuyerIdAndPropertyId(1L, 100L)).thenReturn(true);

		IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
			savedPropertyService.saveProperty(100L, "buyer@example.com");
		});

		assertEquals("Property is already saved", exception.getMessage());
		verify(savedPropertyRepo, never()).save(any(SavedProperty.class));
	}

	@Test
	void testSaveProperty_UserNotFound_ThrowsException() {
		when(userRepo.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

		assertThrows(ResourceNotFoundException.class, () -> {
			savedPropertyService.saveProperty(100L, "unknown@example.com");
		});
	}

	@Test
	void testUnsaveProperty_Success() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(savedPropertyRepo.findByBuyerIdAndPropertyId(1L, 100L)).thenReturn(Optional.of(savedProperty));

		savedPropertyService.unsaveProperty(100L, "buyer@example.com");

		verify(savedPropertyRepo, times(1)).delete(savedProperty);
	}

	@Test
	void testUnsaveProperty_NotFound_ThrowsException() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(savedPropertyRepo.findByBuyerIdAndPropertyId(1L, 100L)).thenReturn(Optional.empty());

		assertThrows(ResourceNotFoundException.class, () -> {
			savedPropertyService.unsaveProperty(100L, "buyer@example.com");
		});
	}

	@Test
	void testGetSavedProperties_Success() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(savedPropertyRepo.findByBuyerId(1L)).thenReturn(List.of(savedProperty));

		List<SavedPropertyResponseDTO> list = savedPropertyService.getSavedProperties("buyer@example.com");

		assertNotNull(list);
		assertEquals(1, list.size());
		assertEquals("Luxury Villa", list.get(0).getProperty().getTitle());
	}

	@Test
	void testIsPropertySaved_True() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(savedPropertyRepo.existsByBuyerIdAndPropertyId(1L, 100L)).thenReturn(true);

		boolean isSaved = savedPropertyService.isPropertySaved(100L, "buyer@example.com");
		assertTrue(isSaved);
	}

	@Test
	void testGetSavedCount_Success() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(savedPropertyRepo.countByBuyerId(1L)).thenReturn(5L);

		long count = savedPropertyService.getSavedCount("buyer@example.com");
		assertEquals(5L, count);
	}
}
