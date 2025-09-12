package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.CouponUsageDTO;
import com.example.enarm360.entities.CouponUsage;
import org.springframework.stereotype.Component;

@Component
public class CouponUsageMapper {
    
    public CouponUsageDTO toDTO(CouponUsage entity) {
        if (entity == null) return null;
        
        CouponUsageDTO dto = new CouponUsageDTO();
        dto.setId(entity.getId());
        
        if (entity.getCoupon() != null) {
            dto.setCouponCode(entity.getCoupon().getCode());
            dto.setCouponName(entity.getCoupon().getName());
        }
        
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUserEmail(entity.getUser().getEmail());
        }
        
        if (entity.getSubscription() != null) {
            dto.setSubscriptionId(entity.getSubscription().getId());
            if (entity.getSubscription().getPlan() != null) {
                dto.setPlanName(entity.getSubscription().getPlan().getName());
            }
        }
        
        dto.setUsedAt(entity.getUsedAt());
        dto.setDiscountApplied(entity.getDiscountApplied());
        dto.setOriginalAmount(entity.getOriginalAmount());
        dto.setFinalAmount(entity.getFinalAmount());
        
        return dto;
    }
}