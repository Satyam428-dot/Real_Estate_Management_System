package com.estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.User;
import com.estate.entities.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmailAndPassword(String email, String password);

	List<User> findByUserRoles(UserRole userRoles);
}
