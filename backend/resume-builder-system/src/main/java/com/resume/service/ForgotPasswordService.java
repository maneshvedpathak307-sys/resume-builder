package com.resume.service;

public interface ForgotPasswordService {


    String resetPassword(
            String email,
            String newPassword,
            String confirmPassword
    );
}