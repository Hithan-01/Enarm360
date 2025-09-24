package com.example.enarm360.dtos;

import com.example.enarm360.entities.SubscriptionPlan;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubscriptionPlanDTO {
    
    @NotBlank(message = "Plan name is required")
    @Size(max = 100, message = "Plan name cannot exceed 100 characters")
    private String name;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be greater than or equal to 0")
    @Digits(integer = 8, fraction = 2, message = "Price format is invalid")
    private BigDecimal price;
    
    @Pattern(regexp = "USD|MXN|EUR", message = "Currency must be USD, MXN, or EUR")
    private String currency = "USD";
    
    @NotNull(message = "Billing interval is required")
    private SubscriptionPlan.BillingInterval billingInterval;
    
    private List<String> features;
    
    @Min(value = 1, message = "Max attempts must be at least 1")
    private Integer maxAttempts;
    
    private Boolean hasClinicalCases = false;
    private Boolean hasExpertExplanations = false;
    private Boolean hasDetailedAnalytics = false;
    private Boolean hasProgressTracking = false;
    private Boolean hasPrioritySupport = false;
}