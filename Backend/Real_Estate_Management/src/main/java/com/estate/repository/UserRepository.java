package com.estate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.User;
import com.estate.entities.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {
	/*
	 * now we will not use this because we have stored the hashed password, so
	 * finding the user by password is of no use, instead we will get the user by
	 * email and then compare the hashed password
	 */
	Optional<User> findByEmail(String email);

	List<User> findByUserRoles(UserRole userRoles);
}
