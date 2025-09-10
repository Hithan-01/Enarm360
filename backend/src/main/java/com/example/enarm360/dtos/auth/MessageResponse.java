package com.example.enarm360.dtos.auth;


import lombok.Data;
@Data
public class MessageResponse {
    private String message;
    private Boolean success;
    
    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
    }
}