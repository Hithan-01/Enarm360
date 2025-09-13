package com.example.enarm360.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.uploads")
public class UploadProperties {
    
    /**
     * Base directory for file uploads
     */
    private String dir = "uploads";
    
    /**
     * Public base URL for serving uploaded files
     */
    private String publicBase = "/uploads";
}