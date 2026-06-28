package com.estate.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estate.dtos.RegisterDto;
import com.estate.service.RegisterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
@CrossOrigin
public class RegisterController {
//adding the service layer dependency
	private final RegisterService registerService;

	@PostMapping
	public String register(@RequestBody RegisterDto registerDto) {
		String resp = registerService.addNewUser(registerDto);
		return resp;
	}
}
