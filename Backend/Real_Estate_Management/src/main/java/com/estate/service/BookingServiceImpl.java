package com.estate.service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.customExceptions.UserNotFoundException;
import com.estate.dtos.BookingRequestDTO;
import com.estate.dtos.BookingResponseDTO;
import com.estate.entities.Booking;
import com.estate.entities.Property;
import com.estate.entities.PropertyImage;
import com.estate.entities.User;
import com.estate.entities.UserRole;
import com.estate.entities.enums.BookingStatus;
import com.estate.repository.BookingRepository;
import com.estate.repository.PropertyRepository;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepo;
	private final PropertyRepository propertyRepo;
	private final UserRepository userRepo;

	@Override
	@Transactional
	public BookingResponseDTO createBooking(BookingRequestDTO dto, String buyerEmail) {
		User buyer = userRepo.findByEmail(buyerEmail)
				.orElseThrow(() -> new UserNotFoundException("Buyer user not found with email: " + buyerEmail));

		Property property = propertyRepo.findById(dto.getPropertyId())
				.orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + dto.getPropertyId()));

		User owner = property.getOwner();

		Booking booking = Booking.builder()
				.buyer(buyer)
				.property(property)
				.owner(owner)
				.fullName(dto.getFullName())
				.email(dto.getEmail())
				.phone(dto.getPhone())
				.bookingDate(dto.getBookingDate())
				.bookingType(dto.getBookingType())
				.tokenAmount(dto.getTokenAmount())
				.messageToOwner(dto.getMessageToOwner())
				.status(BookingStatus.PENDING)
				.build();

		Booking savedBooking = bookingRepo.save(booking);
		return mapToDTO(savedBooking);
	}

	@Override
	public List<BookingResponseDTO> getBuyerBookings(String buyerEmail) {
		User buyer = userRepo.findByEmail(buyerEmail)
				.orElseThrow(() -> new UserNotFoundException("Buyer user not found with email: " + buyerEmail));

		return bookingRepo.findByBuyerId(buyer.getId()).stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<BookingResponseDTO> getOwnerBookings(String ownerEmail) {
		User owner = userRepo.findByEmail(ownerEmail)
				.orElseThrow(() -> new UserNotFoundException("Owner user not found with email: " + ownerEmail));

		return bookingRepo.findByOwnerId(owner.getId()).stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public BookingResponseDTO getBookingById(Long bookingId) {
		Booking booking = bookingRepo.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
		return mapToDTO(booking);
	}

	@Override
	@Transactional
	public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status, String userEmail) {
		Booking booking = bookingRepo.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

		User currentUser = userRepo.findByEmail(userEmail)
				.orElseThrow(() -> new UserNotFoundException("User not found with email: " + userEmail));

		boolean isOwner = booking.getOwner() != null && userEmail.equalsIgnoreCase(booking.getOwner().getEmail());
		boolean isAdmin = currentUser.getUserRoles() == UserRole.ADMIN;

		if (!isOwner && !isAdmin) {
			throw new IllegalStateException("Only the property owner or an admin can update booking status.");
		}

		booking.setStatus(status);
		Booking updated = bookingRepo.save(booking);
		return mapToDTO(updated);
	}

	@Override
	@Transactional
	public void cancelBooking(Long bookingId, String userEmail) {
		Booking booking = bookingRepo.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

		User currentUser = userRepo.findByEmail(userEmail)
				.orElseThrow(() -> new UserNotFoundException("User not found with email: " + userEmail));

		boolean isBuyer = booking.getBuyer() != null && userEmail.equalsIgnoreCase(booking.getBuyer().getEmail());
		boolean isOwner = booking.getOwner() != null && userEmail.equalsIgnoreCase(booking.getOwner().getEmail());
		boolean isAdmin = currentUser.getUserRoles() == UserRole.ADMIN;

		if (!isBuyer && !isOwner && !isAdmin) {
			throw new IllegalStateException("Only the buyer, property owner, or an admin can cancel this booking.");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		bookingRepo.save(booking);
	}

	private BookingResponseDTO mapToDTO(Booking booking) {
		Property property = booking.getProperty();

		String mainImage = null;
		if (property != null && property.getImages() != null && !property.getImages().isEmpty()) {
			mainImage = property.getImages().stream()
					.filter(img -> Boolean.TRUE.equals(img.getIsMain()))
					.map(PropertyImage::getImageUrl)
					.findFirst()
					.orElse(property.getImages().get(0).getImageUrl());
		}

		String locationStr = (property != null) 
				? String.format("%s, %s", property.getAddress(), property.getCity()) 
				: "";

		String formattedAmount = "";
		if (booking.getTokenAmount() != null) {
			NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
			formattedAmount = formatter.format(booking.getTokenAmount());
		}

		String code = String.format("BK-%06d", booking.getId());

		return BookingResponseDTO.builder()
				.bookingId(booking.getId())
				.bookingCode(code)
				.propertyId(property != null ? property.getId() : null)
				.propertyTitle(property != null ? property.getTitle() : "N/A")
				.propertyLocation(locationStr)
				.propertyImage(mainImage)
				.beds(property != null && property.getBedrooms() != null ? property.getBedrooms() : 0)
				.baths(property != null && property.getBathrooms() != null ? property.getBathrooms() : 0)
				.sqft(property != null && property.getAreaSqft() != null ? property.getAreaSqft() : 0)
				.propertyPrice(property != null ? property.getPrice() : null)
				.buyerId(booking.getBuyer() != null ? booking.getBuyer().getId() : null)
				.ownerId(booking.getOwner() != null ? booking.getOwner().getId() : null)
				.fullName(booking.getFullName())
				.email(booking.getEmail())
				.phone(booking.getPhone())
				.bookedOn(booking.getCreatedOn())
				.bookingDate(booking.getBookingDate())
				.bookingType(booking.getBookingType())
				.tokenAmount(booking.getTokenAmount())
				.formattedAmount(formattedAmount)
				.messageToOwner(booking.getMessageToOwner())
				.status(booking.getStatus())
				.build();
	}
}
