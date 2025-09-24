package com.example.enarm360.dtos;

import com.example.enarm360.entities.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuickSubscriptionCheckDTO {
    private Boolean canTakeExam;
    private Integer remainingAttempts;
    private Boolean hasUnlimitedAttempts;
    private Usuario.SubscriptionStatus subscriptionStatus;
    private Boolean hasActiveSubscription;
    private String subscriptionName;
    private Map<String, Boolean> features;
    private Boolean isExpiringSoon;
    private Integer daysRemaining;
}