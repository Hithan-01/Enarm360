package com.example.enarm360.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@EnableScheduling
public class KeepAliveService {
    
    private static final Logger logger = LoggerFactory.getLogger(KeepAliveService.class);
    
    // Se ejecuta cada 10 minutos para mantener el servidor activo
    @Scheduled(fixedRate = 600000) // 600000 ms = 10 minutos
    public void keepAlive() {
        logger.info("Keep-alive ejecutado a las: {}", LocalDateTime.now());
        
        // Simula actividad básica
        Runtime runtime = Runtime.getRuntime();
        long memoryUsed = runtime.totalMemory() - runtime.freeMemory();
        
        logger.info("Servidor activo - Memoria en uso: {} MB", memoryUsed / (1024 * 1024));
    }
}