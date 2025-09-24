package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.PaymentHistoryDTO;
import com.example.enarm360.entities.PaymentHistory;
import org.springframework.stereotype.Component;

@Component
public class PaymentHistoryMapper {
    
    public PaymentHistoryDTO toDTO(PaymentHistory entity) {
        if (entity == null) return null;
        
        PaymentHistoryDTO dto = new PaymentHistoryDTO();
        dto.setId(entity.getId());
        
        if (entity.getSubscription() != null) {
            dto.setSubscriptionId(entity.getSubscription().getId());
            if (entity.getSubscription().getPlan() != null) {
                dto.setPlanName(entity.getSubscription().getPlan().getName());
            }
        }
        
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUserEmail(entity.getUser().getEmail());
        }
        
        dto.setAmount(entity.getAmount());
        dto.setCurrency(entity.getCurrency());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setPaymentReference(entity.getPaymentReference());
        dto.setPaymentDate(entity.getPaymentDate());
        dto.setStatus(entity.getStatus());
        dto.setDescription(entity.getDescription());
        dto.setMetadata(entity.getMetadata());
        dto.setCreatedAt(entity.getCreatedAt());
        
        return dto;
    }
}