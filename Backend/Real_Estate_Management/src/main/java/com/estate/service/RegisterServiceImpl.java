package com.estate.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estate.dtos.RegisterDto;
import com.estate.entities.User;
import com.estate.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RegisterServiceImpl implements RegisterService {
	private final UserRepository userRepo;
	private final ModelMapper mapper;

	@Override
	@Transactional
	public String addNewUser(RegisterDto registerDto) {
		User userEntity = mapper.map(registerDto, User.class);

//		System.out.println(userEntity);
		User persistentUser = userRepo.save(userEntity);
		if (persistentUser != null) {
			return "User added successfully";
		} else {
			return "error in adding user";
		}
	}
}
