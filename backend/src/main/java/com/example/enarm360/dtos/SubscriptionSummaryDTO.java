package com.example.enarm360.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionSummaryDTO {
    private BigDecimal monthlyRevenue;
    private Integer activeSubscriptions;
    private BigDecimal growthRate;
    private BigDecimal retentionRate;
    private BigDecimal churnRate;
    private Integer newSubscriptions;
    private Integer cancelledSubscriptions;
}