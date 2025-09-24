package com.example.enarm360.dtos;

import com.example.enarm360.entities.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String currency;
    private SubscriptionPlan.BillingInterval billingInterval;
    private List<String> features;
    private Boolean isActive;
    private Integer maxAttempts;
    private Boolean hasClinicalCases;
    private Boolean hasExpertExplanations;
    private Boolean hasDetailedAnalytics;
    private Boolean hasProgressTracking;
    private Boolean hasPrioritySupport;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer subscribersCount; // Para mostrar estadísticas
    private BigDecimal totalRevenue; // Para mostrar estadísticas
}