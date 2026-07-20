package com.estate.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.customExceptions.InvalidCredentialException;
import com.estate.dtos.LoginDto;
import com.estate.entities.User;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
	private final UserRepository userRepo;

	@Override
	public User loginUser(LoginDto loginDto) {
		String email = loginDto.getEmail();
		String password = loginDto.getPassword();
		User userEntity = userRepo.findByEmailAndPassword(email, password);
		if (userEntity != null) {
			return userEntity;
		} else {
			throw new InvalidCredentialException("Invalid email or password");
		}
	}

}
