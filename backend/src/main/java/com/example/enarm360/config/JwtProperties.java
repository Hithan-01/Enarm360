package com.example.enarm360.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    
    /**
     * JWT secret key for signing tokens
     */
    private String secret;
    
    /**
     * JWT access token expiration time in milliseconds
     */
    private long expiration = 3600000; // 1 hour default
    
    /**
     * JWT refresh token expiration time in milliseconds
     */
    private long refreshExpiration = 604800000; // 7 days default
}