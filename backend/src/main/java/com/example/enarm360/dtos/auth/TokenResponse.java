package com.example.enarm360.dtos.auth;


import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class TokenResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long expiresIn;
}
