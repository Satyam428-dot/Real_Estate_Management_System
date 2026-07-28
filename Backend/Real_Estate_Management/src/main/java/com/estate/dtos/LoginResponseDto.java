package com.estate.dtos;

import com.estate.entities.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDto {
	private String token;
	private Long userId;
	private String email;
	private UserRole userRole;
	private String firstName;
	private String lastName;
}
