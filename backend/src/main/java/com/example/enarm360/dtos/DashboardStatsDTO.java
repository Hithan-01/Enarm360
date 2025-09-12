package com.example.enarm360.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private BigDecimal monthlyRevenue;
    private Integer activeSubscriptions;
    private BigDecimal growthRate;
    private BigDecimal retentionRate;
    private List<SubscriptionPlanDTO> plans;
    private List<DiscountCouponDTO> activeCoupons;
    private List<PaymentHistoryDTO> recentPayments;
    private List<UserSubscriptionDTO> expiringSubscriptions;
}