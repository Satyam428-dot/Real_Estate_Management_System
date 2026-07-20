package com.estate.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.ResourceNotFoundException;
import com.estate.entities.User;
import com.estate.entities.UserRole;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
	private final UserRepository userRepo;

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

}
