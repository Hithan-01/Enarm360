// UsuarioService.java - Servicio completo desde cero
package com.example.enarm360.services;

import com.example.enarm360.config.SubscriptionConfig;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.entities.UserSubscription;
import com.example.enarm360.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionConfig subscriptionConfig;
    
    // =======================================================
    // MÉTODOS BÁSICOS DE USUARIO (CRUD)
    // =======================================================
    
    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByIdOptional(Long id) {
        return usuarioRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }
    
    public Usuario createUsuario(Usuario usuario) {
        // Validar que email y username sean únicos
        if (existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuario.getEmail());
        }
        
        if (existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("Ya existe un usuario con el username: " + usuario.getUsername());
        }
        
        // Encriptar contraseña si no está encriptada
        if (usuario.getContrasenaHash() != null && !usuario.getContrasenaHash().startsWith("$2a$")) {
            usuario.setContrasenaHash(passwordEncoder.encode(usuario.getContrasenaHash()));
        }
        
        // Establecer valores por defecto
        usuario.setActivo(true);
        usuario.setSubscriptionStatus(Usuario.SubscriptionStatus.FREE);
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        log.info("Usuario creado: {} - {}", savedUsuario.getUsername(), savedUsuario.getEmail());
        
        return savedUsuario;
    }
    
    public Usuario updateUsuario(Long id, Usuario usuarioUpdate) {
        Usuario existingUsuario = findById(id);
        
        // Validar unicidad de email (excluyendo el usuario actual)
        if (!existingUsuario.getEmail().equals(usuarioUpdate.getEmail()) && 
            existsByEmail(usuarioUpdate.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuarioUpdate.getEmail());
        }
        
        // Validar unicidad de username (excluyendo el usuario actual)
        if (!existingUsuario.getUsername().equals(usuarioUpdate.getUsername()) && 
            existsByUsername(usuarioUpdate.getUsername())) {
            throw new RuntimeException("Ya existe un usuario con el username: " + usuarioUpdate.getUsername());
        }
        
        // Actualizar campos
        existingUsuario.setEmail(usuarioUpdate.getEmail());
        existingUsuario.setUsername(usuarioUpdate.getUsername());
        existingUsuario.setNombre(usuarioUpdate.getNombre());
        existingUsuario.setApellidos(usuarioUpdate.getApellidos());
        
        // Solo actualizar contraseña si se proporciona una nueva
        if (usuarioUpdate.getContrasenaHash() != null && 
            !usuarioUpdate.getContrasenaHash().trim().isEmpty() &&
            !usuarioUpdate.getContrasenaHash().startsWith("$2a$")) {
            existingUsuario.setContrasenaHash(passwordEncoder.encode(usuarioUpdate.getContrasenaHash()));
        }
        
        Usuario savedUsuario = usuarioRepository.save(existingUsuario);
        log.info("Usuario actualizado: {}", savedUsuario.getUsername());
        
        return savedUsuario;
    }
    
    public void deleteUsuario(Long id) {
        Usuario usuario = findById(id);
        usuarioRepository.delete(usuario);
        log.info("Usuario eliminado: {}", usuario.getUsername());
    }
    
    public void activateUsuario(Long id) {
        Usuario usuario = findById(id);
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
        log.info("Usuario activado: {}", usuario.getUsername());
    }
    
    public void deactivateUsuario(Long id) {
        Usuario usuario = findById(id);
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
        log.info("Usuario desactivado: {}", usuario.getUsername());
    }
    
    // =======================================================
    // MÉTODOS DE SUSCRIPCIONES
    // =======================================================
    
    /**
     * Obtiene información completa de la suscripción del usuario
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserSubscriptionInfo(Long userId) {
        Usuario usuario = findById(userId);
        
        Map<String, Object> info = new HashMap<>();
        info.put("userId", usuario.getId());
        info.put("username", usuario.getUsername());
        info.put("email", usuario.getEmail());
        info.put("hasActiveSubscription", usuario.hasActiveSubscription());
        info.put("subscriptionStatus", usuario.getSubscriptionStatus());
        info.put("subscriptionName", usuario.getSubscriptionDisplayName());
        info.put("isExpiringSoon", usuario.isSubscriptionExpiringSoon());
        info.put("remainingAttempts", usuario.getRemainingAttempts());
        info.put("subscriptionSummary", usuario.getSubscriptionSummary());
        
        if (usuario.getCurrentSubscription() != null) {
            UserSubscription current = usuario.getCurrentSubscription();
            Map<String, Object> subscriptionDetails = new HashMap<>();
            subscriptionDetails.put("id", current.getId());
            subscriptionDetails.put("planName", current.getPlan().getName());
            subscriptionDetails.put("planPrice", current.getPlan().getPrice());
            subscriptionDetails.put("currency", current.getPlan().getCurrency());
            subscriptionDetails.put("startDate", current.getStartDate());
            subscriptionDetails.put("endDate", current.getEndDate());
            subscriptionDetails.put("autoRenew", current.getAutoRenew());
            subscriptionDetails.put("isActive", current.isActive());
            subscriptionDetails.put("status", current.getStatus());
            subscriptionDetails.put("paymentMethod", current.getPaymentMethod());
            
            // Calcular días restantes
            if (current.getEndDate() != null) {
                long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(
                    LocalDateTime.now(), 
                    current.getEndDate()
                );
                subscriptionDetails.put("daysRemaining", Math.max(0, daysRemaining));
            }
            
            info.put("currentSubscription", subscriptionDetails);
        }
        
        // Características disponibles según la suscripción
        Map<String, Boolean> features = new HashMap<>();
        features.put("basicQuestions", usuario.hasFeature("basic_questions"));
        features.put("allQuestions", usuario.hasFeature("all_questions"));
        features.put("clinicalCases", usuario.hasFeature("clinical_cases"));
        features.put("expertExplanations", usuario.hasFeature("expert_explanations"));
        features.put("detailedAnalytics", usuario.hasFeature("detailed_analytics"));
        features.put("progressTracking", usuario.hasFeature("progress_tracking"));
        features.put("prioritySupport", usuario.hasFeature("priority_support"));
        features.put("unlimitedAttempts", usuario.hasFeature("unlimited_attempts"));
        
        info.put("features", features);
        
        return info;
    }
    
    /**
     * Verifica si el usuario tiene una característica específica
     */
    @Transactional(readOnly = true)
    public boolean userHasFeature(Long userId, String feature) {
        Usuario usuario = findById(userId);
        return usuario.hasFeature(feature);
    }
    
    /**
     * Verifica si el usuario puede tomar exámenes
     */
    @Transactional(readOnly = true)
    public boolean userCanTakeExam(Long userId) {
        Usuario usuario = findById(userId);
        return usuario.canTakeExam();
    }
    
    /**
     * Obtiene el número de intentos restantes del usuario
     */
    @Transactional(readOnly = true)
    public int getUserRemainingAttempts(Long userId) {
        Usuario usuario = findById(userId);
        return usuario.getRemainingAttempts();
    }
    
    /**
     * Obtiene información específica para exámenes
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserExamInfo(Long userId) {
        Usuario usuario = findById(userId);
        
        Map<String, Object> examInfo = new HashMap<>();
        examInfo.put("canTakeExam", usuario.canTakeExam());
        examInfo.put("remainingAttempts", usuario.getRemainingAttempts());
        examInfo.put("hasUnlimitedAttempts", usuario.getRemainingAttempts() == Integer.MAX_VALUE);
        examInfo.put("subscriptionStatus", usuario.getSubscriptionStatus());
        examInfo.put("hasActiveSubscription", usuario.hasActiveSubscription());
        examInfo.put("subscriptionName", usuario.getSubscriptionDisplayName());
        
        // Límites específicos según el tipo de suscripción
        if (!usuario.hasActiveSubscription()) {
            examInfo.put("maxAttemptsAllowed", subscriptionConfig.getMaxAttempts().getFree());
            examInfo.put("subscriptionType", "FREE");
        } else if (usuario.getSubscriptionStatus() == Usuario.SubscriptionStatus.TRIAL) {
            examInfo.put("maxAttemptsAllowed", subscriptionConfig.getMaxAttempts().getTrial());
            examInfo.put("subscriptionType", "TRIAL");
        } else {
            Integer planMaxAttempts = usuario.getCurrentSubscription().getPlan().getMaxAttempts();
            examInfo.put("maxAttemptsAllowed", planMaxAttempts != null ? planMaxAttempts : Integer.MAX_VALUE);
            examInfo.put("subscriptionType", usuario.getSubscriptionStatus().toString());
        }
        
        return examInfo;
    }
    
    /**
     * Verifica si el usuario tiene una suscripción activa
     */
    @Transactional(readOnly = true)
    public boolean hasActiveSubscription(Long userId) {
        Usuario usuario = findById(userId);
        return usuario.hasActiveSubscription();
    }
    
    /**
     * Obtiene el estado de suscripción del usuario
     */
    @Transactional(readOnly = true)
    public Usuario.SubscriptionStatus getUserSubscriptionStatus(Long userId) {
        Usuario usuario = findById(userId);
        return usuario.getSubscriptionStatus();
    }
    
    /**
     * Actualiza el estado de suscripción del usuario
     */
    public void updateUserSubscriptionStatus(Long userId) {
        Usuario usuario = findById(userId);
        usuario.updateSubscriptionStatus();
        usuarioRepository.save(usuario);
        
        log.info("Estado de suscripción actualizado para usuario {}: {}", 
                usuario.getUsername(), usuario.getSubscriptionStatus());
    }
    
    // =======================================================
    // MÉTODOS PARA CONSULTAS DE SUSCRIPCIONES
    // =======================================================
    
    @Transactional(readOnly = true)
    public List<Usuario> getUsersWithExpiringSubscriptions(int days) {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(days);
        
        return usuarioRepository.findUsersWithSubscriptionsExpiringBetween(start, end);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> getUsersBySubscriptionStatus(Usuario.SubscriptionStatus status) {
        return usuarioRepository.findBySubscriptionStatus(status);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> getUsersWithActiveSubscriptions() {
        return usuarioRepository.findUsersWithActiveSubscriptions();
    }
    
    @Transactional(readOnly = true)
    public Integer countUsersBySubscriptionStatus(Usuario.SubscriptionStatus status) {
        return usuarioRepository.countBySubscriptionStatus(status);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> getUsersWithActivePlan(Long planId) {
        return usuarioRepository.findUsersWithActivePlan(planId);
    }
    
    // =======================================================
    // MÉTODOS DE UTILIDAD Y ESTADÍSTICAS
    // =======================================================
    
    /**
     * Obtiene estadísticas generales de usuarios
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Conteos generales
        stats.put("totalUsers", usuarioRepository.count());
        stats.put("activeUsers", usuarioRepository.countByActivo(true));
        stats.put("inactiveUsers", usuarioRepository.countByActivo(false));
        
        // Estadísticas por tipo de suscripción
        Map<String, Integer> subscriptionStats = new HashMap<>();
        for (Usuario.SubscriptionStatus status : Usuario.SubscriptionStatus.values()) {
            subscriptionStats.put(status.toString(), countUsersBySubscriptionStatus(status));
        }
        stats.put("subscriptionStats", subscriptionStats);
        
        // Usuarios con suscripciones activas
        stats.put("usersWithActiveSubscriptions", getUsersWithActiveSubscriptions().size());
        
        // Usuarios próximos a expirar (próximos 7 días)
        stats.put("usersExpiringNext7Days", getUsersWithExpiringSubscriptions(7).size());
        
        return stats;
    }
    
    /**
     * Busca usuarios por término de búsqueda (nombre, email, username)
     */
    @Transactional(readOnly = true)
    public List<Usuario> searchUsers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findAll();
        }
        
        String term = "%" + searchTerm.toLowerCase() + "%";
        return usuarioRepository.findBySearchTerm(term);
    }
    
    /**
     * Verifica si un usuario puede acceder a una característica premium
     */
    @Transactional(readOnly = true)
    public Map<String, Object> checkPremiumFeatureAccess(Long userId, String feature) {
        Usuario usuario = findById(userId);
        boolean hasAccess = usuario.hasFeature(feature);
        
        Map<String, Object> result = new HashMap<>();
        result.put("hasAccess", hasAccess);
        result.put("feature", feature);
        result.put("userId", userId);
        result.put("subscriptionStatus", usuario.getSubscriptionStatus());
        
        if (!hasAccess) {
            result.put("upgradeRequired", true);
            result.put("currentPlan", usuario.getSubscriptionDisplayName());
            result.put("message", getUpgradeMessage(feature));
        }
        
        return result;
    }
    
    private String getUpgradeMessage(String feature) {
        return switch (feature) {
            case "clinical_cases" -> "Los casos clínicos están disponibles en el plan Premium";
            case "expert_explanations" -> "Las explicaciones de expertos requieren plan Premium";
            case "detailed_analytics" -> "Los análisis detallados están disponibles en planes Standard y Premium";
            case "unlimited_attempts" -> "Los intentos ilimitados requieren una suscripción activa";
            case "priority_support" -> "El soporte prioritario está disponible en el plan Premium";
            default -> "Esta característica requiere una suscripción activa";
        };
    }
    
    /**
     * Método para integración con el sistema de autenticación
     */
    @Transactional(readOnly = true)
    public Usuario loadUserForAuthentication(String emailOrUsername) {
        // Primero intentar por email
        Optional<Usuario> usuarioOpt = findByEmail(emailOrUsername);
        
        // Si no se encuentra por email, intentar por username
        if (usuarioOpt.isEmpty()) {
            usuarioOpt = findByUsername(emailOrUsername);
        }
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado: " + emailOrUsername);
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario desactivado: " + emailOrUsername);
        }
        
        return usuario;
    }
    
    /**
     * Cambia la contraseña del usuario
     */
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        Usuario usuario = findById(userId);
        
        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, usuario.getContrasenaHash())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }
        
        // Establecer nueva contraseña
        usuario.setContrasenaHash(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        
        log.info("Contraseña cambiada para usuario: {}", usuario.getUsername());
    }
    
    /**
     * Resetea la contraseña del usuario (solo para admins)
     */
    public void resetPassword(Long userId, String newPassword) {
        Usuario usuario = findById(userId);
        usuario.setContrasenaHash(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        
        log.info("Contraseña reseteada para usuario: {} por admin", usuario.getUsername());
    }
}