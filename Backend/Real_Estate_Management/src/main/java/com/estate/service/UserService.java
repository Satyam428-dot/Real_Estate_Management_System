package com.estate.service;

import java.util.List;

import com.estate.entities.User;

public interface UserService {

	List<User> getAllUsers();

	List<User> getAllOwners();

	List<User> getAllCustomers();

}
