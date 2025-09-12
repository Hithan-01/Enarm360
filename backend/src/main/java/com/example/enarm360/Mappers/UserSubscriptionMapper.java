package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.UserSubscriptionDTO;
import com.example.enarm360.entities.UserSubscription;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class UserSubscriptionMapper {
    
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    
    public UserSubscriptionDTO toDTO(UserSubscription entity) {
        if (entity == null) return null;
        
        UserSubscriptionDTO dto = new UserSubscriptionDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setUserEmail(entity.getUser().getEmail());
        dto.setUserName(entity.getUser().getNombre() + " " + 
                       (entity.getUser().getApellidos() != null ? entity.getUser().getApellidos() : ""));
        dto.setPlan(subscriptionPlanMapper.toDTO(entity.getPlan()));
        dto.setStatus(entity.getStatus());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setAutoRenew(entity.getAutoRenew());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setPaymentReference(entity.getPaymentReference());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setIsActive(entity.isActive());
        dto.setIsExpired(entity.isExpired());
        
        // Calcular días restantes
        if (entity.getEndDate() != null && entity.isActive()) {
            long daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), entity.getEndDate());
            dto.setDaysRemaining((int) Math.max(0, daysRemaining));
        }
        
        return dto;
    }
}