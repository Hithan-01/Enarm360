package com.example.enarm360.dtos;

import com.example.enarm360.entities.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscriptionInfoDTO {
    private Long userId;
    private String username;
    private String email;
    private Usuario.SubscriptionStatus subscriptionStatus;
    private String subscriptionDisplayName;
    private Boolean hasActiveSubscription;
    private Boolean isSubscriptionExpiringSoon;
    private Integer remainingAttempts;
    private String subscriptionSummary;
    private UserSubscriptionDTO currentSubscription;
    private Map<String, Boolean> features;
}