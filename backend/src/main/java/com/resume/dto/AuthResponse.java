package com.resume.dto;

public class AuthResponse {

    private String token;
    private String message;
    private Long userId;
    private String fullName;
    private Long personalId;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, Long userId, String fullName, Long personalId) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.fullName = fullName;
        this.personalId = personalId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getPersonalId() {
        return personalId;
    }

    public void setPersonalId(Long personalId) {
        this.personalId = personalId;
    }
}