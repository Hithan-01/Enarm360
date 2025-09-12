package com.example.enarm360.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubscriptionDTO {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Plan ID is required")
    private Long planId;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String paymentMethod;
    private String paymentReference;
    private String couponCode; // Para aplicar cupón
}