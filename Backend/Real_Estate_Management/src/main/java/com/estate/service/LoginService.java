package com.estate.service;

import com.estate.dtos.LoginDto;
import com.estate.entities.User;

public interface LoginService {

	User loginUser(LoginDto loginDto);

}
