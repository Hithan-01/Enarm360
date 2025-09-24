package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.CreateSubscriptionPlanDTO;
import com.example.enarm360.dtos.SubscriptionPlanDTO;
import com.example.enarm360.entities.SubscriptionPlan;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPlanMapper {
    
    public SubscriptionPlanDTO toDTO(SubscriptionPlan entity) {
        if (entity == null) return null;
        
        SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setCurrency(entity.getCurrency());
        dto.setBillingInterval(entity.getBillingInterval());
        dto.setFeatures(entity.getFeatures());
        dto.setIsActive(entity.getIsActive());
        dto.setMaxAttempts(entity.getMaxAttempts());
        dto.setHasClinicalCases(entity.getHasClinicalCases());
        dto.setHasExpertExplanations(entity.getHasExpertExplanations());
        dto.setHasDetailedAnalytics(entity.getHasDetailedAnalytics());
        dto.setHasProgressTracking(entity.getHasProgressTracking());
        dto.setHasPrioritySupport(entity.getHasPrioritySupport());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        return dto;
    }
    
    public SubscriptionPlan toEntity(CreateSubscriptionPlanDTO dto) {
        if (dto == null) return null;
        
        SubscriptionPlan entity = new SubscriptionPlan();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setCurrency(dto.getCurrency());
        entity.setBillingInterval(dto.getBillingInterval());
        entity.setFeatures(dto.getFeatures());
        entity.setMaxAttempts(dto.getMaxAttempts());
        entity.setHasClinicalCases(dto.getHasClinicalCases());
        entity.setHasExpertExplanations(dto.getHasExpertExplanations());
        entity.setHasDetailedAnalytics(dto.getHasDetailedAnalytics());
        entity.setHasProgressTracking(dto.getHasProgressTracking());
        entity.setHasPrioritySupport(dto.getHasPrioritySupport());
        
        return entity;
    }
    
    public void updateEntityFromDTO(CreateSubscriptionPlanDTO dto, SubscriptionPlan entity) {
        if (dto == null || entity == null) return;
        
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setCurrency(dto.getCurrency());
        entity.setBillingInterval(dto.getBillingInterval());
        entity.setFeatures(dto.getFeatures());
        entity.setMaxAttempts(dto.getMaxAttempts());
        entity.setHasClinicalCases(dto.getHasClinicalCases());
        entity.setHasExpertExplanations(dto.getHasExpertExplanations());
        entity.setHasDetailedAnalytics(dto.getHasDetailedAnalytics());
        entity.setHasProgressTracking(dto.getHasProgressTracking());
        entity.setHasPrioritySupport(dto.getHasPrioritySupport());
    }
}