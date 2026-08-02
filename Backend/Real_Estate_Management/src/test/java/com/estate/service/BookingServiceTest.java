package com.estate.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import com.estate.dtos.BookingRequestDTO;
import com.estate.dtos.BookingResponseDTO;
import com.estate.entities.Booking;
import com.estate.entities.Property;
import com.estate.entities.User;
import com.estate.entities.UserRole;
import com.estate.entities.enums.BookingStatus;
import com.estate.entities.enums.BookingType;
import com.estate.repository.BookingRepository;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

	@Mock
	private BookingRepository bookingRepo;

	@Mock
	private PropertyRepository propertyRepo;

	@Mock
	private UserRepository userRepo;

	@InjectMocks
	private BookingServiceImpl bookingService;

	private User buyer;
	private User owner;
	private Property property;
	private Booking booking;

	@BeforeEach
	void setUp() {
		buyer = new User();
		buyer.setId(1L);
		buyer.setEmail("buyer@example.com");
		buyer.setFirstName("Buyer");
		buyer.setLastName("User");
		buyer.setUserRoles(UserRole.CUSTOMER);

		owner = new User();
		owner.setId(2L);
		owner.setEmail("owner@example.com");
		owner.setFirstName("Owner");
		owner.setLastName("User");
		owner.setUserRoles(UserRole.OWNER);

		property = new Property();
		property.setId(50L);
		property.setOwner(owner);
		property.setTitle("Green Acres Apartment");
		property.setAddress("456 Park Road");
		property.setCity("Mumbai");
		property.setPrice(BigDecimal.valueOf(7500000.0));
		property.setImages(new ArrayList<>());

		booking = Booking.builder()
				.buyer(buyer)
				.owner(owner)
				.property(property)
				.fullName("Buyer User")
				.email("buyer@example.com")
				.phone("9876543210")
				.bookingDate(LocalDate.now().plusDays(5))
				.bookingType(BookingType.BOOK_PROPERTY)
				.tokenAmount(50000.0)
				.messageToOwner("Interested in viewing")
				.status(BookingStatus.PENDING)
				.build();
		booking.setId(101L);
	}

	@Test
	void testCreateBooking_Success() {
		BookingRequestDTO dto = new BookingRequestDTO();
		dto.setPropertyId(50L);
		dto.setFullName("Buyer User");
		dto.setEmail("buyer@example.com");
		dto.setPhone("9876543210");
		dto.setBookingDate(LocalDate.now().plusDays(5));
		dto.setBookingType(BookingType.BOOK_PROPERTY);
		dto.setTokenAmount(50000.0);
		dto.setMessageToOwner("Interested in viewing");

		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(propertyRepo.findById(50L)).thenReturn(Optional.of(property));
		when(bookingRepo.save(any(Booking.class))).thenReturn(booking);

		BookingResponseDTO response = bookingService.createBooking(dto, "buyer@example.com");

		assertNotNull(response);
		assertEquals(101L, response.getBookingId());
		assertEquals("BK-000101", response.getBookingCode());
		assertEquals("Green Acres Apartment", response.getPropertyTitle());
		assertEquals(BookingStatus.PENDING, response.getStatus());
		verify(bookingRepo, times(1)).save(any(Booking.class));
	}

	@Test
	void testGetBuyerBookings_Success() {
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(bookingRepo.findByBuyerId(1L)).thenReturn(List.of(booking));

		List<BookingResponseDTO> bookings = bookingService.getBuyerBookings("buyer@example.com");

		assertNotNull(bookings);
		assertEquals(1, bookings.size());
		assertEquals("BK-000101", bookings.get(0).getBookingCode());
	}

	@Test
	void testGetOwnerBookings_Success() {
		when(userRepo.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
		when(bookingRepo.findByOwnerId(2L)).thenReturn(List.of(booking));

		List<BookingResponseDTO> bookings = bookingService.getOwnerBookings("owner@example.com");

		assertNotNull(bookings);
		assertEquals(1, bookings.size());
		assertEquals("BK-000101", bookings.get(0).getBookingCode());
	}

	@Test
	void testGetBookingById_Success() {
		when(bookingRepo.findById(101L)).thenReturn(Optional.of(booking));

		BookingResponseDTO dto = bookingService.getBookingById(101L);

		assertNotNull(dto);
		assertEquals(101L, dto.getBookingId());
	}

	@Test
	void testGetBookingById_NotFound_ThrowsException() {
		when(bookingRepo.findById(999L)).thenReturn(Optional.empty());

		assertThrows(ResourceNotFoundException.class, () -> {
			bookingService.getBookingById(999L);
		});
	}

	@Test
	void testUpdateBookingStatus_ByOwner_Success() {
		when(bookingRepo.findById(101L)).thenReturn(Optional.of(booking));
		when(userRepo.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
		when(bookingRepo.save(any(Booking.class))).thenReturn(booking);

		BookingResponseDTO updated = bookingService.updateBookingStatus(101L, BookingStatus.CONFIRMED, "owner@example.com");

		assertNotNull(updated);
		verify(bookingRepo, times(1)).save(booking);
	}

	@Test
	void testUpdateBookingStatus_UnauthorizedUser_ThrowsException() {
		User unauthorizedUser = new User();
		unauthorizedUser.setId(99L);
		unauthorizedUser.setEmail("stranger@example.com");
		unauthorizedUser.setUserRoles(UserRole.CUSTOMER);

		when(bookingRepo.findById(101L)).thenReturn(Optional.of(booking));
		when(userRepo.findByEmail("stranger@example.com")).thenReturn(Optional.of(unauthorizedUser));

		assertThrows(IllegalStateException.class, () -> {
			bookingService.updateBookingStatus(101L, BookingStatus.CONFIRMED, "stranger@example.com");
		});
	}

	@Test
	void testCancelBooking_ByBuyer_Success() {
		when(bookingRepo.findById(101L)).thenReturn(Optional.of(booking));
		when(userRepo.findByEmail("buyer@example.com")).thenReturn(Optional.of(buyer));
		when(bookingRepo.save(any(Booking.class))).thenReturn(booking);

		bookingService.cancelBooking(101L, "buyer@example.com");

		assertEquals(BookingStatus.CANCELLED, booking.getStatus());
		verify(bookingRepo, times(1)).save(booking);
	}
}
