package com.estate.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.dtos.LoginRequestDto;
import com.estate.dtos.LoginResponseDto;
import com.estate.entities.User;
import com.estate.repository.UserRepository;
import com.estate.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepo;
	private final JwtUtil jwtUtil;

	@Override
	public LoginResponseDto loginUser(LoginRequestDto loginDto) {

		// Step 1:Authenticate User
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

		// Step 2:Fetch User from DB
		/*
		 * Because authentication manager is only responsible for authenticating the
		 * user It does not return the user entity which is required for the token
		 * generation
		 */
		String email = loginDto.getEmail();
		User userEntity = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// Step 3: Generate JWT
		String tokenString = jwtUtil.generateToken(userEntity);

		// Step 4:Return Response DTO
		return new LoginResponseDto(tokenString, userEntity.getId(), userEntity.getEmail(), userEntity.getUserRoles(), userEntity.getFirstName(), userEntity.getLastName());
	}

}
