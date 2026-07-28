package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

import com.estate.dtos.ChangePasswordRequest;
import com.estate.dtos.UserStatusRequest;
import com.estate.dtos.ProfileUpdateRequest;
import com.estate.dtos.UserProfileResponse;
import com.estate.entities.User;
import com.estate.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	// ---------------------Get all users-----------------------------------
//	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping
	public ResponseEntity<?> getAllUsers() {
		try {
			List<User> users = userService.getAllUsers();
			return ResponseEntity.ok(users);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// ---------------------Get all owners-----------------------------------
//	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/role/owners")
	public ResponseEntity<?> getAllOwners() {
		try {
			List<User> owners = userService.getAllOwners();
			return ResponseEntity.ok(owners);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// ---------------------Get all Customers-----------------------------------
//	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/role/customers")
	public ResponseEntity<?> getAllCustomers() {
		try {
			List<User> customers = userService.getAllCustomers();
			return ResponseEntity.ok(customers);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// ------------------------Get User By Id-------------------------------------
//	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable long id) {
		try {
			User user = userService.getUserById(id);
			return ResponseEntity.ok(user);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// ------------------------Update Admin-------------------------------------
//	@PreAuthorize("hasAuthority('ADMIN')")
	@PutMapping("/admin/{id}")
	public ResponseEntity<?> updateAdmin(@PathVariable long id, @RequestBody User user) {
		try {
			User updatedAdmin = userService.updateAdmin(id, user);
			return ResponseEntity.ok(updatedAdmin);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	// ------------------------Change password-------------------------------------
	// @PreAuthorize("hasAuthority('ADMIN')")

	@PutMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {

		userService.changePassword(request);

		return ResponseEntity.ok("Password changed successfully");
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<?> updateUserStatus(@PathVariable long id,
			@Valid @RequestBody UserStatusRequest request) {
		try {
			return ResponseEntity.ok(userService.updateUserStatus(id, request));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping("/me")
	public ResponseEntity<?> getMyProfile(Authentication authentication) {
		try {
			return ResponseEntity.ok(toProfileResponse(userService.getUserByEmail(authentication.getName())));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PutMapping("/me")
	public ResponseEntity<?> updateMyProfile(Authentication authentication, @Valid @RequestBody ProfileUpdateRequest request) {
		return ResponseEntity.ok(toProfileResponse(userService.updateMyProfile(authentication.getName(), request)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateUserById(@PathVariable long id, @Valid @RequestBody ProfileUpdateRequest request) {
		try {
			return ResponseEntity.ok(toProfileResponse(userService.updateUserById(id, request)));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	private UserProfileResponse toProfileResponse(User user) {
		return new UserProfileResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhone(), user.getCreatedOn());
	}
}
