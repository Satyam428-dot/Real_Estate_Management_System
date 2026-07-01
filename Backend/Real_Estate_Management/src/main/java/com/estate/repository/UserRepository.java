package com.estate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmailAndPassword(String email, String password);
}
