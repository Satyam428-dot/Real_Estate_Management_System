package com.estate.service;

import com.estate.dtos.LoginRequestDto;
import com.estate.dtos.LoginResponseDto;

public interface LoginService {

	LoginResponseDto loginUser(LoginRequestDto loginDto);

}
