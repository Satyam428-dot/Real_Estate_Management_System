package com.estate.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.customExceptions.InvalidCredentialException;
import com.estate.dtos.LoginDto;
import com.estate.entities.User;
import com.estate.service.LoginService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {
	private final LoginService loginService;

	@PostMapping
	public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
		try {
			User userEntity = loginService.loginUser(loginDto);
			return ResponseEntity.ok(userEntity);
		} catch (InvalidCredentialException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
}
