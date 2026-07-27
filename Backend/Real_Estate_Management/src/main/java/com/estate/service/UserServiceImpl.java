package com.estate.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.dtos.ChangePasswordRequest;
import com.estate.dtos.UserStatusRequest;
import com.estate.dtos.ProfileUpdateRequest;
import com.estate.entities.User;
import com.estate.entities.UserRole;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
	private final UserRepository userRepo;
	private final PasswordEncoder passwordEncoder;

	@Override
	public List<User> getAllUsers() {
		List<User> users = userRepo.findAll();
		return users;
	}

	@Override
	public List<User> getAllOwners() {
		List<User> owners = userRepo.findByUserRoles(UserRole.OWNER);
		return owners;
	}

	@Override
	public List<User> getAllCustomers() {
		List<User> customers = userRepo.findByUserRoles(UserRole.CUSTOMER);
		return customers;
	}

	@Override
	public User getUserById(long id) {
		User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("The user not found"));
		return user;
	}

	@Override
	@Transactional
	public User updateAdmin(long id, User userDetails) {
		User existingAdmin = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("The user not found"));

		if (existingAdmin.getUserRoles() != UserRole.ADMIN) {
			throw new ResourceNotFoundException("User with id: " + id + " is not an admin");
		}

		existingAdmin.setFirstName(userDetails.getFirstName());
		existingAdmin.setLastName(userDetails.getLastName());
		existingAdmin.setEmail(userDetails.getEmail());
		existingAdmin.setPhone(userDetails.getPhone());
		// password and userRoles intentionally NOT updated here —
		// handle those via dedicated endpoints (e.g. change-password, change-role)

		return userRepo.save(existingAdmin);
	}

	@Override
	@Transactional
	public void changePassword(ChangePasswordRequest request) {
		// TODO Auto-generated method stub
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {

			throw new RuntimeException("Current password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepo.save(user);

	}

	@Override
	@Transactional
	public User updateUserStatus(long id, UserStatusRequest request) {
		User user = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("The user not found"));
		user.setStatus(request.getStatus());
		return userRepo.save(user);
	}

	@Override
	public User getUserByEmail(String email) {
		return userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	@Override
	@Transactional
	public User updateMyProfile(String email, ProfileUpdateRequest request) {
		User user = getUserByEmail(email);
		user.setFirstName(request.getFirstName().trim());
		user.setLastName(request.getLastName().trim());
		user.setPhone(request.getPhone() == null ? null : request.getPhone().trim());
		return userRepo.save(user);
	}

}
