package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.CreateDiscountCouponDTO;
import com.example.enarm360.dtos.DiscountCouponDTO;
import com.example.enarm360.entities.DiscountCoupon;
import org.springframework.stereotype.Component;

@Component
public class DiscountCouponMapper {
    
    public DiscountCouponDTO toDTO(DiscountCoupon entity) {
        if (entity == null) return null;
        
        DiscountCouponDTO dto = new DiscountCouponDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDiscountType(entity.getDiscountType());
        dto.setDiscountValue(entity.getDiscountValue());
        dto.setCurrency(entity.getCurrency());
        dto.setMinAmount(entity.getMinAmount());
        dto.setMaxDiscount(entity.getMaxDiscount());
        dto.setUsageLimit(entity.getUsageLimit());
        dto.setUsageLimitPerUser(entity.getUsageLimitPerUser());
        dto.setCurrentUsage(entity.getCurrentUsage());
        dto.setApplicablePlans(entity.getApplicablePlans());
        dto.setStartDate(entity.getStartDate());
        dto.setExpirationDate(entity.getExpirationDate());
        dto.setIsActive(entity.getIsActive());
        
        if (entity.getCreatedBy() != null) {
            dto.setCreatedByEmail(entity.getCreatedBy().getEmail());
        }
        
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setIsValid(entity.isValid());
        
        // Calcular usos restantes
        if (entity.getUsageLimit() != null) {
            dto.setRemainingUses(entity.getUsageLimit() - entity.getCurrentUsage());
        }
        
        return dto;
    }
    
    public DiscountCoupon toEntity(CreateDiscountCouponDTO dto) {
        if (dto == null) return null;
        
        DiscountCoupon entity = new DiscountCoupon();
        entity.setCode(dto.getCode().toUpperCase()); // Normalizar a mayúsculas
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setDiscountType(dto.getDiscountType());
        entity.setDiscountValue(dto.getDiscountValue());
        entity.setCurrency(dto.getCurrency());
        entity.setMinAmount(dto.getMinAmount());
        entity.setMaxDiscount(dto.getMaxDiscount());
        entity.setUsageLimit(dto.getUsageLimit());
        entity.setUsageLimitPerUser(dto.getUsageLimitPerUser());
        entity.setApplicablePlans(dto.getApplicablePlans());
        entity.setStartDate(dto.getStartDate());
        entity.setExpirationDate(dto.getExpirationDate());
        entity.setCurrentUsage(0);
        
        return entity;
    }
    
    public void updateEntityFromDTO(CreateDiscountCouponDTO dto, DiscountCoupon entity) {
        if (dto == null || entity == null) return;
        
        entity.setCode(dto.getCode().toUpperCase());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setDiscountType(dto.getDiscountType());
        entity.setDiscountValue(dto.getDiscountValue());
        entity.setCurrency(dto.getCurrency());
        entity.setMinAmount(dto.getMinAmount());
        entity.setMaxDiscount(dto.getMaxDiscount());
        entity.setUsageLimit(dto.getUsageLimit());
        entity.setUsageLimitPerUser(dto.getUsageLimitPerUser());
        entity.setApplicablePlans(dto.getApplicablePlans());
        entity.setStartDate(dto.getStartDate());
        entity.setExpirationDate(dto.getExpirationDate());
    }
}