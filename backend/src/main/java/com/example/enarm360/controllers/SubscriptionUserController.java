package com.example.enarm360.controllers;

import com.example.enarm360.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/subscription")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionUserController {
    
    private final UsuarioService usuarioService;
    
    @GetMapping("/info")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSubscriptionInfo(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        
        try {
            // Implementar método en UsuarioService para obtener info completa
            Map<String, Object> info = usuarioService.getUserSubscriptionInfo(userId);
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al obtener información de suscripción"));
        }
    }
    
    @GetMapping("/features/{feature}")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkFeature(
            @PathVariable String feature,
            Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        boolean hasFeature = usuarioService.userHasFeature(userId, feature);
        
        return ResponseEntity.ok(Map.of("hasFeature", hasFeature));
    }
    
    @GetMapping("/can-take-exam")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> canTakeExam(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        
        try {
            Map<String, Object> examInfo = usuarioService.getUserExamInfo(userId);
            return ResponseEntity.ok(examInfo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al verificar permisos de examen"));
        }
    }
    
    @GetMapping("/remaining-attempts")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRemainingAttempts(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        int remainingAttempts = usuarioService.getUserRemainingAttempts(userId);
        
        return ResponseEntity.ok(Map.of(
                "remainingAttempts", remainingAttempts,
                "hasUnlimitedAttempts", remainingAttempts == Integer.MAX_VALUE
        ));
    }
    
    private Long getUserIdFromAuth(Authentication auth) {
        return Long.valueOf(auth.getName()); // Ajustar según tu implementación JWT
    }
}