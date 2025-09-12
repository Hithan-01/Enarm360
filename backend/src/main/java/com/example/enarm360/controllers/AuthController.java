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
    // AUTENTICACIÓN
    // ==========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Solicitud de login para: {}", loginRequest.getLogin());
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException | UsernameNotFoundException e) {
            logger.warn("Credenciales inválidas para {}: {}", loginRequest.getLogin(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Credenciales inválidas",
                            "success", false
                    ));
        } catch (LockedException e) {
            logger.warn("Usuario bloqueado {}: {}", loginRequest.getLogin(), e.getMessage());
            return ResponseEntity.status(HttpStatus.LOCKED)
                    .body(Map.of(
                            "message", "Usuario bloqueado",
                            "success", false
                    ));
        } catch (DisabledException e) {
            logger.warn("Usuario deshabilitado {}: {}", loginRequest.getLogin(), e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message", "Usuario deshabilitado",
                            "success", false
                    ));
        } catch (JwtException e) {
            logger.error("Error JWT durante login para {}", loginRequest.getLogin(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Error al generar el token",
                            "success", false
                    ));
        } catch (Exception e) {
            logger.error("Error en login para {}", loginRequest.getLogin(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Error del servidor",
                            "success", false
                    ));
        }
    }

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
    // ROLES Y PERMISOS
    // ==========================================================

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

    @GetMapping("/me/is-admin")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkIsAdmin() {
        try {
            boolean isAdmin = authService.hasRole("ADMIN");
            return ResponseEntity.ok(Map.of("isAdmin", isAdmin));
        } catch (Exception e) {
            logger.error("Error al verificar rol ADMIN: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Error al verificar rol",
                        "success", false
                    ));
        }
    }

    @GetMapping("/me/is-estudiante")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkIsEstudiante() {
        try {
            boolean isEstudiante = authService.hasRole("ESTUDIANTE");
            return ResponseEntity.ok(Map.of("isEstudiante", isEstudiante));
        } catch (Exception e) {
            logger.error("Error al verificar rol ESTUDIANTE: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message", "Error al verificar rol",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // DTO INTERNO
    // ==========================================================

    public static class ActiveSessionsResponse {
        private Long activeSessions;

        public ActiveSessionsResponse(Long activeSessions) {
            this.activeSessions = activeSessions;
        }

        public Long getActiveSessions() { return activeSessions; }
        public void setActiveSessions(Long activeSessions) { this.activeSessions = activeSessions; }
    }
}