package com.example.enarm360.controllers;

import com.example.enarm360.dtos.CreateSubscriptionDTO;
import com.example.enarm360.dtos.UserSubscriptionDTO;
import com.example.enarm360.services.UserSubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserSubscriptionController {
    
    private final UserSubscriptionService userSubscriptionService;
    
    @GetMapping("/current")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<UserSubscriptionDTO> getCurrentSubscription(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        
        return userSubscriptionService.getCurrentSubscription(userId)
                .map(subscription -> ResponseEntity.ok(subscription))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/history")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<List<UserSubscriptionDTO>> getSubscriptionHistory(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        List<UserSubscriptionDTO> history = userSubscriptionService.getUserSubscriptionHistory(userId);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserSubscriptionDTO>> getUserSubscriptions(@PathVariable Long userId) {
        List<UserSubscriptionDTO> subscriptions = userSubscriptionService.getUserSubscriptionHistory(userId);
        return ResponseEntity.ok(subscriptions);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<?> createSubscription(
            @Valid @RequestBody CreateSubscriptionDTO createDTO,
            Authentication auth) {
        try {
            // Si no se especifica userId, usar el del token
            if (createDTO.getUserId() == null) {
                createDTO.setUserId(getUserIdFromAuth(auth));
            } else {
                // Solo admins pueden crear suscripciones para otros usuarios
                if (!hasRole(auth, "ADMIN") && !createDTO.getUserId().equals(getUserIdFromAuth(auth))) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "No autorizado para crear suscripciones para otros usuarios"));
                }
            }
            
            UserSubscriptionDTO subscription = userSubscriptionService.createSubscription(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long id,
            Authentication auth) {
        try {
            Long userId = getUserIdFromAuth(auth);
            UserSubscriptionDTO cancelledSubscription = userSubscriptionService.cancelSubscription(id, userId);
            return ResponseEntity.ok(cancelledSubscription);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/renew")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> renewSubscription(@PathVariable Long id) {
        try {
            UserSubscriptionDTO renewedSubscription = userSubscriptionService.renewSubscription(id);
            return ResponseEntity.ok(renewedSubscription);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/expiring")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserSubscriptionDTO>> getExpiringSubscriptions(
            @RequestParam(defaultValue = "7") int daysAhead) {
        List<UserSubscriptionDTO> expiring = userSubscriptionService.getExpiringSubscriptions(daysAhead);
        return ResponseEntity.ok(expiring);
    }
    
    // Métodos de utilidad (implementar según tu sistema de JWT)
    private Long getUserIdFromAuth(Authentication auth) {
        // Implementar según tu configuración JWT
        // Por ejemplo, si guardas el ID en el principal:
        return Long.valueOf(auth.getName()); // Placeholder - ajustar según tu implementación
    }
    
    private boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }
}
