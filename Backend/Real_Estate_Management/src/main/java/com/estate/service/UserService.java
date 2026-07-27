package com.estate.service;

import java.util.List;

import com.estate.dtos.ChangePasswordRequest;
import com.estate.dtos.UserStatusRequest;
import com.estate.dtos.ProfileUpdateRequest;
import com.estate.entities.User;

public interface UserService {

	List<User> getAllUsers();

	List<User> getAllOwners();

	List<User> getAllCustomers();

	User getUserById(long id);

	User updateAdmin(long id, User user);

	void changePassword(ChangePasswordRequest request);

	User updateUserStatus(long id, UserStatusRequest request);

	User getUserByEmail(String email);

	User updateMyProfile(String email, ProfileUpdateRequest request);

}
