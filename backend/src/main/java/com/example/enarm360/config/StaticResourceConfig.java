package com.example.enarm360.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path dir = Path.of("uploads","avatars").toAbsolutePath().normalize();
        registry.addResourceHandler("/static/avatars/**")
                .addResourceLocations("file:" + dir.toString() + "/");
    }
}
