package com.estate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.entities.User;
import com.estate.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	// ---------------------Get all users-----------------------------------
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
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable long id) {
		try {
			User user = userService.getUserById(id);
			return ResponseEntity.ok(user);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
}
