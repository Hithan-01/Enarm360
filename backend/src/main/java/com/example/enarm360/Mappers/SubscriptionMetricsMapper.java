package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.SubscriptionMetricsDTO;
import com.example.enarm360.entities.SubscriptionMetrics;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMetricsMapper {
    
    public SubscriptionMetricsDTO toDTO(SubscriptionMetrics entity) {
        if (entity == null) return null;
        
        SubscriptionMetricsDTO dto = new SubscriptionMetricsDTO();
        dto.setId(entity.getId());
        dto.setMetricDate(entity.getMetricDate());
        dto.setTotalRevenue(entity.getTotalRevenue());
        dto.setActiveSubscriptions(entity.getActiveSubscriptions());
        dto.setNewSubscriptions(entity.getNewSubscriptions());
        dto.setCancelledSubscriptions(entity.getCancelledSubscriptions());
        dto.setChurnRate(entity.getChurnRate());
        dto.setGrowthRate(entity.getGrowthRate());
        dto.setRetentionRate(entity.getRetentionRate());
        dto.setPlanMetrics(entity.getPlanMetrics());
        
        return dto;
    }
    
    public SubscriptionMetrics toEntity(SubscriptionMetricsDTO dto) {
        if (dto == null) return null;
        
        SubscriptionMetrics entity = new SubscriptionMetrics();
        entity.setId(dto.getId());
        entity.setMetricDate(dto.getMetricDate());
        entity.setTotalRevenue(dto.getTotalRevenue());
        entity.setActiveSubscriptions(dto.getActiveSubscriptions());
        entity.setNewSubscriptions(dto.getNewSubscriptions());
        entity.setCancelledSubscriptions(dto.getCancelledSubscriptions());
        entity.setChurnRate(dto.getChurnRate());
        entity.setGrowthRate(dto.getGrowthRate());
        entity.setRetentionRate(dto.getRetentionRate());
        entity.setPlanMetrics(dto.getPlanMetrics());
        
        return entity;
    }
    
    public void updateEntityFromDTO(SubscriptionMetricsDTO dto, SubscriptionMetrics entity) {
        if (dto == null || entity == null) return;
        
        entity.setMetricDate(dto.getMetricDate());
        entity.setTotalRevenue(dto.getTotalRevenue());
        entity.setActiveSubscriptions(dto.getActiveSubscriptions());
        entity.setNewSubscriptions(dto.getNewSubscriptions());
        entity.setCancelledSubscriptions(dto.getCancelledSubscriptions());
        entity.setChurnRate(dto.getChurnRate());
        entity.setGrowthRate(dto.getGrowthRate());
        entity.setRetentionRate(dto.getRetentionRate());
        entity.setPlanMetrics(dto.getPlanMetrics());
    }
}