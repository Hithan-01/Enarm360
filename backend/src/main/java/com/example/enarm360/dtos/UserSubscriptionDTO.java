package com.example.enarm360.dtos;

import com.example.enarm360.entities.UserSubscription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscriptionDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private SubscriptionPlanDTO plan;
    private UserSubscription.SubscriptionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean autoRenew;
    private String paymentMethod;
    private String paymentReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
    private Boolean isExpired;
    private Integer daysRemaining;
}
