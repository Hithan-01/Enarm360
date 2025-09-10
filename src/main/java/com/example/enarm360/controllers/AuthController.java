package com.example.enarm360.controllers;

import com.example.enarm360.dtos.auth.*;
import com.example.enarm360.services.AuthService;

import io.jsonwebtoken.JwtException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    // ==========================================================
    // ENDPOINTS EXISTENTES DE AUTENTICACIÓN
    // ==========================================================

    /**
     * Endpoint de login - acepta email O username
     */
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
    logger.info("Solicitud de login para: {}", loginRequest.getLogin());
    try {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);

    } catch (BadCredentialsException | UsernameNotFoundException e) {
        // Credenciales inválidas → 401
        logger.warn("Credenciales inválidas para {}: {}", loginRequest.getLogin(), e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "message", "Credenciales inválidas",
                        "success", false
                ));

    } catch (LockedException e) {
        // Usuario bloqueado → 423 (Locked)
        logger.warn("Usuario bloqueado {}: {}", loginRequest.getLogin(), e.getMessage());
        return ResponseEntity.status(HttpStatus.LOCKED)
                .body(Map.of(
                        "message", "Usuario bloqueado",
                        "success", false
                ));

    } catch (DisabledException e) {
        // Usuario deshabilitado → 403
        logger.warn("Usuario deshabilitado {}: {}", loginRequest.getLogin(), e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "message", "Usuario deshabilitado",
                        "success", false
                ));

    } catch (JwtException e) {
        // Error al firmar/validar JWT (clave corta, token mal formado, etc.) → 500
        logger.error("Error JWT durante login para {}",
                loginRequest.getLogin(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "Error al generar el token",
                        "success", false
                ));

    } catch (Exception e) {
        // Cualquier otro error del servidor (JPQL DELETE sin executeUpdate, DB, etc.) → 500
        logger.error("Error en login para {}",
                loginRequest.getLogin(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "Error del servidor",
                        "success", false
                ));
    }
}

    /**
     * Endpoint para renovar access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            logger.debug("Solicitud de refresh token");
            
            TokenResponse response = authService.refreshToken(request);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en refresh token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Token de refresh inválido o expirado",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para logout (cerrar sesión actual)
     */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        try {
            logger.debug("Solicitud de logout");
            
            authService.logout(request.getRefreshToken());
            
            return ResponseEntity.ok(Map.of(
                "message", "Logout exitoso",
                "success", true
            ));
            
        } catch (Exception e) {
            logger.error("Error en logout: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al cerrar sesión",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para cerrar todas las sesiones del usuario
     */
    @PostMapping("/logout-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logoutAll() {
        try {
            logger.debug("Solicitud de logout de todas las sesiones");
            
            UsuarioInfo currentUser = authService.getCurrentUser();
            authService.logoutAll(currentUser.getId());
            
            return ResponseEntity.ok(Map.of(
                "message", "Todas las sesiones han sido cerradas",
                "success", true
            ));
            
        } catch (Exception e) {
            logger.error("Error en logout all: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al cerrar todas las sesiones",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para obtener información del usuario actual
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser() {
        try {
            logger.debug("Solicitud de información de usuario actual");
            
            UsuarioInfo userInfo = authService.getCurrentUser();
            
            return ResponseEntity.ok(userInfo);
            
        } catch (Exception e) {
            logger.error("Error al obtener usuario actual: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Usuario no autenticado",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para verificar disponibilidad de username o email
     */
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

    /**
     * Endpoint específico para verificar email
     */
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

    /**
     * Endpoint específico para verificar username
     */
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

    /**
     * Endpoint para obtener sesiones activas del usuario
     */
    @GetMapping("/sessions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getActiveSessions() {
        try {
            UsuarioInfo currentUser = authService.getCurrentUser();
            Long activeSessionsCount = authService.getActiveSessionsCount(currentUser.getId());
            
            return ResponseEntity.ok(new ActiveSessionsResponse(activeSessionsCount));
            
        } catch (Exception e) {
            logger.error("Error al obtener sesiones activas: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al obtener sesiones activas",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // NUEVOS ENDPOINTS PARA GESTIÓN DE ROLES Y DASHBOARDS
    // ==========================================================

    /**
     * Endpoint para obtener roles del usuario actual
     */
    @GetMapping("/me/roles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyRoles() {
        try {
            Set<String> roles = authService.getCurrentUserRoles();
            
            return ResponseEntity.ok(Map.of(
                "roles", roles,
                "isAdmin", roles.contains("ROLE_ADMIN"),
                "isEstudiante", roles.contains("ROLE_ESTUDIANTE")
            ));
            
        } catch (Exception e) {
            logger.error("Error al obtener roles: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Error al obtener roles",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para verificar si usuario tiene rol de ADMIN
     */
    @GetMapping("/me/is-admin")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkIsAdmin() {
        try {
            boolean isAdmin = authService.hasRole("ADMIN");
            
            return ResponseEntity.ok(Map.of(
                "isAdmin", isAdmin
            ));
            
        } catch (Exception e) {
            logger.error("Error al verificar rol ADMIN: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Error al verificar rol",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para verificar si usuario tiene rol de ESTUDIANTE
     */
    @GetMapping("/me/is-estudiante")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkIsEstudiante() {
        try {
            boolean isEstudiante = authService.hasRole("ESTUDIANTE");
            
            return ResponseEntity.ok(Map.of(
                "isEstudiante", isEstudiante
            ));
            
        } catch (Exception e) {
            logger.error("Error al verificar rol ESTUDIANTE: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Error al verificar rol",
                        "success", false
                    ));
        }
    }

    /**
     * Dashboard para administradores
     */
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDashboard() {
        try {
            logger.debug("Acceso a dashboard admin");
            
            Map<String, Object> adminData = Map.of(
                "message", "Bienvenido Administrador",
                "stats", Map.of(
                    "usuariosActivos", 150,
                    "preguntasTotales", 1250,
                    "examenesCreados", 45
                ),
                "actions", new String[]{
                    "Gestionar usuarios", 
                    "Ver reportes", 
                    "Administrar contenido"
                },
                "accessLevel", "ADMIN"
            );
            
            return ResponseEntity.ok(adminData);
            
        } catch (Exception e) {
            logger.error("Error en admin dashboard: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Acceso denegado: Se requiere rol ADMIN",
                        "success", false
                    ));
        }
    }

    /**
     * Dashboard para estudiantes
     */
    @GetMapping("/estudiante/dashboard")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<?> estudianteDashboard() {
        try {
            logger.debug("Acceso a dashboard estudiante");
            
            Map<String, Object> estudianteData = Map.of(
                "message", "Bienvenido Estudiante",
                "stats", Map.of(
                    "cursosInscritos", 5,
                    "examenesCompletados", 12,
                    "puntuacionPromedio", 85.5
                ),
                "actions", new String[]{
                    "Tomar exámenes", 
                    "Ver progreso", 
                    "Revisar resultados"
                },
                "accessLevel", "ESTUDIANTE"
            );
            
            return ResponseEntity.ok(estudianteData);
            
        } catch (Exception e) {
            logger.error("Error en estudiante dashboard: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Acceso denegado: Se requiere rol ESTUDIANTE",
                        "success", false
                    ));
        }
    }

    /**
     * Endpoint para ambos roles (estudiante y admin)
     */
    @GetMapping("/dashboard/general")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESTUDIANTE')")
    public ResponseEntity<?> generalDashboard() {
        try {
            logger.debug("Acceso a dashboard general");
            
            Set<String> roles = authService.getCurrentUserRoles();
            boolean isAdmin = roles.contains("ROLE_ADMIN");
            
            Map<String, Object> generalData = Map.of(
                "message", isAdmin ? "Bienvenido Administrador" : "Bienvenido Estudiante",
                "userRole", isAdmin ? "ADMIN" : "ESTUDIANTE",
                "features", isAdmin ? 
                    new String[]{"Gestión de usuarios", "Reportes", "Administración"} :
                    new String[]{"Tomar exámenes", "Ver progreso", "Resultados"}
            );
            
            return ResponseEntity.ok(generalData);
            
        } catch (Exception e) {
            logger.error("Error en dashboard general: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Acceso denegado",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // DTOs INTERNOS
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

    public static class ActiveSessionsResponse {
        private Long activeSessions;

        public ActiveSessionsResponse(Long activeSessions) {
            this.activeSessions = activeSessions;
        }

        public Long getActiveSessions() { return activeSessions; }
        public void setActiveSessions(Long activeSessions) { this.activeSessions = activeSessions; }
    }
}