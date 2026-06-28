package com.estate.dtos;

import com.estate.entities.UserRole;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RegisterDto {
	private long id;
	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	private UserRole userRoles;
	private String password;
}
