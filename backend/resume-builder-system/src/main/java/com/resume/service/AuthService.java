package com.resume.service;

import com.resume.dto.AuthResponse;
import com.resume.dto.LoginRequest;
import com.resume.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}