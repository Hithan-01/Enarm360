package com.example.enarm360.security;

import com.example.enarm360.dtos.auth.UsuarioInfo;
import com.example.enarm360.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscriptionSecurityUtils {
    
    private final AuthService authService;
    /**
     * Extrae el ID del usuario usando tu AuthService existente
     */
    public Long getUserIdFromAuth(Authentication auth) {
        try {
            UsuarioInfo currentUser = authService.getCurrentUser();
            return currentUser.getId();
        } catch (Exception e) {
            throw new RuntimeException("No se pudo obtener el ID del usuario: " + e.getMessage());
        }
    }
    
    /**
     * Verifica si el usuario tiene un rol específico
     */
    public boolean hasRole(Authentication auth, String role) {
        if (auth == null) return false;
        
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_" + role));
    }
    
    /**
     * Verifica si el usuario es administrador
     */
    public boolean isAdmin(Authentication auth) {
        return hasRole(auth, "ADMIN");
    }
    
    /**
     * Verifica si el usuario puede acceder a un recurso de otro usuario
     */
    public boolean canAccessUserResource(Authentication auth, Long targetUserId) {
        if (auth == null || targetUserId == null) return false;
        
        try {
            Long currentUserId = getUserIdFromAuth(auth);
            return currentUserId.equals(targetUserId) || isAdmin(auth);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verifica roles usando tu AuthService existente
     */
    public boolean hasRoleUsingAuthService(String role) {
        try {
            return authService.hasRole(role);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Obtiene información del usuario actual
     */
    public UsuarioInfo getCurrentUserInfo() {
        try {
            return authService.getCurrentUser();
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener información del usuario actual: " + e.getMessage());
        }
    }
}