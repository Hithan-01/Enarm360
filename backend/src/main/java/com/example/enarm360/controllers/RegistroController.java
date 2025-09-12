package com.example.enarm360.controllers;

import com.example.enarm360.dtos.registrer.PasswordValidationResponse;
import com.example.enarm360.dtos.registrer.RegistroInfoResponse;
import com.example.enarm360.dtos.registrer.RegistroRequest;
import com.example.enarm360.dtos.registrer.RegistroResponse;
import com.example.enarm360.services.AuthService;
import com.example.enarm360.services.RegistroService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/registro")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RegistroController {

    private static final Logger logger = LoggerFactory.getLogger(RegistroController.class);

    @Autowired
    private RegistroService registroService;

    @Autowired
    private AuthService authService;

    // ==========================================================
    // REGISTRO PRINCIPAL
    // ==========================================================

    @PostMapping("/crear-cuenta")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody RegistroRequest request) {
        logger.info("Solicitud de registro para email: {}", request.getEmail());
        
        try {
            // Validar disponibilidad antes de crear
            if (authService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "El email ya está registrado",
                        "field", "email",
                        "success", false
                    ));
            }
            
            if (authService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "El username ya está en uso", 
                        "field", "username",
                        "success", false
                    ));
            }
            
            // Crear el usuario
            RegistroResponse response = registroService.registrarUsuario(request);
            
            logger.info("Usuario registrado exitosamente: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Error de validación en registro: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "message", e.getMessage(),
                    "success", false
                ));
        } catch (Exception e) {
            logger.error("Error en registro para {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "message", "Error del servidor al crear cuenta",
                    "success", false
                ));
        }
    }

    // ==========================================================
    // INFORMACIÓN PARA FORMULARIO
    // ==========================================================

    @GetMapping("/info")
    public ResponseEntity<?> getRegistroInfo() {
        try {
            RegistroInfoResponse info = registroService.getInformacionRegistro();
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            logger.error("Error al obtener info de registro: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "message", "Error al cargar información",
                    "success", false
                ));
        }
    }

    // ==========================================================
    // VALIDACIONES
    // ==========================================================

    @PostMapping("/validar-password")
    public ResponseEntity<?> validarPassword(@RequestBody Map<String, String> request) {
        try {
            String password = request.get("password");
            
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "valido", false,
                    "mensaje", "Contraseña es requerida"
                ));
            }
            
            PasswordValidationResponse validation = registroService.validarPassword(password);
            return ResponseEntity.ok(validation);
            
        } catch (Exception e) {
            logger.error("Error al validar password: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "message", "Error al validar contraseña",
                    "success", false
                ));
        }
    }

    // ==========================================================
    // VERIFICACIONES DE DISPONIBILIDAD
    // ==========================================================

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam String field, 
            @RequestParam String value) {
        try {
            AuthService.CheckAvailabilityResponse response = 
                authService.checkAvailability(field, value);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al verificar disponibilidad: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al verificar disponibilidad",
                        "success", false
                    ));
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        try {
            boolean exists = authService.existsByEmail(email);
            return ResponseEntity.ok(new CheckFieldResponse(!exists, 
                exists ? "Email ya está en uso" : "Email disponible"));
        } catch (Exception e) {
            logger.error("Error al verificar email: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al verificar email",
                        "success", false
                    ));
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        try {
            boolean exists = authService.existsByUsername(username);
            return ResponseEntity.ok(new CheckFieldResponse(!exists, 
                exists ? "Username ya está en uso" : "Username disponible"));
        } catch (Exception e) {
            logger.error("Error al verificar username: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al verificar username",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // DTO INTERNO
    // ==========================================================

    public static class CheckFieldResponse {
        private boolean available;
        private String message;

        public CheckFieldResponse(boolean available, String message) {
            this.available = available;
            this.message = message;
        }

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}