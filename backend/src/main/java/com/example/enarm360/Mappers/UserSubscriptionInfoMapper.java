package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.UserSubscriptionInfoDTO;
import com.example.enarm360.entities.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class UserSubscriptionInfoMapper {
    
    private final UserSubscriptionMapper userSubscriptionMapper;
    
    public UserSubscriptionInfoDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;
        
        UserSubscriptionInfoDTO dto = new UserSubscriptionInfoDTO();
        dto.setUserId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setSubscriptionStatus(usuario.getSubscriptionStatus());
        dto.setSubscriptionDisplayName(usuario.getSubscriptionDisplayName());
        dto.setHasActiveSubscription(usuario.hasActiveSubscription());
        dto.setIsSubscriptionExpiringSoon(usuario.isSubscriptionExpiringSoon());
        dto.setRemainingAttempts(usuario.getRemainingAttempts());
        dto.setSubscriptionSummary(usuario.getSubscriptionSummary());
        
        if (usuario.getCurrentSubscription() != null) {
            dto.setCurrentSubscription(userSubscriptionMapper.toDTO(usuario.getCurrentSubscription()));
        }
        
        // Mapear características
        Map<String, Boolean> features = new HashMap<>();
        features.put("basicQuestions", usuario.hasFeature("basic_questions"));
        features.put("allQuestions", usuario.hasFeature("all_questions"));
        features.put("clinicalCases", usuario.hasFeature("clinical_cases"));
        features.put("expertExplanations", usuario.hasFeature("expert_explanations"));
        features.put("detailedAnalytics", usuario.hasFeature("detailed_analytics"));
        features.put("progressTracking", usuario.hasFeature("progress_tracking"));
        features.put("prioritySupport", usuario.hasFeature("priority_support"));
        features.put("unlimitedAttempts", usuario.hasFeature("unlimited_attempts"));
        
        dto.setFeatures(features);
        
        return dto;
    }
}