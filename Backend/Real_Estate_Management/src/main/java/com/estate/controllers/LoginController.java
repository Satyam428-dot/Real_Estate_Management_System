package com.estate.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.LoginRequestDto;
import com.estate.dtos.LoginResponseDto;
import com.estate.service.LoginService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {
	private final LoginService loginService;

	@PostMapping
	public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto) {
		try {
			LoginResponseDto response = loginService.loginUser(loginDto);
			return ResponseEntity.ok(response);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
}
