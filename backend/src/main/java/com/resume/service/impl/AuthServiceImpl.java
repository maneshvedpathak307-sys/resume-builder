package com.resume.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.resume.dto.AuthResponse;
import com.resume.dto.LoginRequest;
import com.resume.dto.RegisterRequest;
import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.security.JwtService;
import com.resume.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PersonalRepository personalRepository;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PersonalRepository personalRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.personalRepository = personalRepository;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
    	
    	System.out.println("===== REGISTER REQUEST =====");
    	System.out.println(request.getFullName());
    	System.out.println(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(
                    null,
                    "Email already exists",
                    null,
                    null,
                    null
            );
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
        
        System.out.println("Saved User ID = " + user.getId());

        String token = jwtService.generateToken(user.getEmail());

        Personal personal = personalRepository
                .findFirstByUserId(user.getId())
                .orElse(null);

        Long personalId = personal != null ? personal.getId() : null;

        return new AuthResponse(
                token,
                "Registration Successful",
                user.getId(),
                user.getFullName(),
                personalId
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new AuthResponse(
                    null,
                    "Invalid Email",
                    null,
                    null,
                    null
            );
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(
                    null,
                    "Invalid Password",
                    null,
                    null,
                    null
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        Personal personal = personalRepository
                .findFirstByUserId(user.getId())
                .orElse(null);

        Long personalId = personal != null ? personal.getId() : null;

        return new AuthResponse(
                token,
                "Login Successful",
                user.getId(),
                user.getFullName(),
                personalId
        );
    }
}