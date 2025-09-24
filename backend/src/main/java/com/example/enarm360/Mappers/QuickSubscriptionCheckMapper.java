package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.QuickSubscriptionCheckDTO;
import com.example.enarm360.entities.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class QuickSubscriptionCheckMapper {
    
    public QuickSubscriptionCheckDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;
        
        QuickSubscriptionCheckDTO dto = new QuickSubscriptionCheckDTO();
        dto.setCanTakeExam(usuario.canTakeExam());
        dto.setRemainingAttempts(usuario.getRemainingAttempts());
        dto.setHasUnlimitedAttempts(usuario.getRemainingAttempts() == Integer.MAX_VALUE);
        dto.setSubscriptionStatus(usuario.getSubscriptionStatus());
        dto.setHasActiveSubscription(usuario.hasActiveSubscription());
        dto.setSubscriptionName(usuario.getSubscriptionDisplayName());
        dto.setIsExpiringSoon(usuario.isSubscriptionExpiringSoon());
        
        // Calcular días restantes si tiene suscripción activa
        if (usuario.hasActiveSubscription() && usuario.getCurrentSubscription().getEndDate() != null) {
            long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(
                LocalDateTime.now(), 
                usuario.getCurrentSubscription().getEndDate()
            );
            dto.setDaysRemaining((int) Math.max(0, daysRemaining));
        }
        
        // Características principales para UI
        Map<String, Boolean> features = new HashMap<>();
        features.put("clinicalCases", usuario.hasFeature("clinical_cases"));
        features.put("detailedAnalytics", usuario.hasFeature("detailed_analytics"));
        features.put("progressTracking", usuario.hasFeature("progress_tracking"));
        features.put("unlimitedAttempts", usuario.hasFeature("unlimited_attempts"));
        features.put("expertExplanations", usuario.hasFeature("expert_explanations"));
        features.put("prioritySupport", usuario.hasFeature("priority_support"));
        
        dto.setFeatures(features);
        
        return dto;
    }
}