package com.resume.service.impl;

import com.resume.entity.User;
import com.resume.repository.UserRepository;
import com.resume.service.ForgotPasswordService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ForgotPasswordServiceImpl
        implements ForgotPasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String resetPassword(
            String email,
            String newPassword,
            String confirmPassword) {

        // Check email
        if (email == null || email.trim().isEmpty()) {
            return "Email is required";
        }

        // Check new password
        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

            return "New password is required";
        }

        // Check confirm password
        if (confirmPassword == null ||
                confirmPassword.trim().isEmpty()) {

            return "Confirm password is required";
        }

        // Check password match
        if (!newPassword.equals(confirmPassword)) {
            return "Passwords do not match";
        }

        email = email.trim().toLowerCase();

        // Find user
        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "Email not registered";
        }

        User user = optionalUser.get();

        // Encrypt password using BCrypt
        String encryptedPassword =
                passwordEncoder.encode(newPassword);

        user.setPassword(encryptedPassword);

        // Save updated password
        userRepository.save(user);

        return "Password updated successfully";
    }
}