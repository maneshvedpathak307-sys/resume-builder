package com.resume.controller;

import com.resume.dto.ForgotPasswordRequest;
import com.resume.service.ForgotPasswordService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class ForgotPasswordController {

    private final ForgotPasswordService service;

    public ForgotPasswordController(
            ForgotPasswordService service) {

        this.service = service;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        String result =
                service.resetPassword(
                        request.getEmail(),
                        request.getNewPassword(),
                        request.getConfirmPassword()
                );

        if (result.equals("Password updated successfully")) {

            return ResponseEntity.ok(result);
        }

        return ResponseEntity.badRequest().body(result);
    }
}