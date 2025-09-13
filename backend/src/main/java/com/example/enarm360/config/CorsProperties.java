package com.example.enarm360.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {
    
    /**
     * List of allowed origins for CORS
     */
    private List<String> allowedOrigins;
}