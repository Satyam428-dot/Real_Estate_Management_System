package com.estate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estate.entities.User;

public interface RegisterRepository extends JpaRepository<User, Long> {

}
