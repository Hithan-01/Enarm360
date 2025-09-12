package com.example.enarm360.services;

import com.example.enarm360.dtos.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SubscriptionDashboardService {
    
    private final SubscriptionPlanService subscriptionPlanService;
    private final UserSubscriptionService userSubscriptionService;
    private final DiscountCouponService discountCouponService;
    private final PaymentHistoryService paymentHistoryService;
    private final SubscriptionMetricsService subscriptionMetricsService;
    
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Revenue y métricas básicas
        stats.setMonthlyRevenue(paymentHistoryService.getMonthlyRevenue());
        
        // Obtener métricas más recientes
        subscriptionMetricsService.getLatestMetrics().ifPresent(metrics -> {
            stats.setActiveSubscriptions(metrics.getActiveSubscriptions());
            stats.setGrowthRate(metrics.getGrowthRate());
            stats.setRetentionRate(metrics.getRetentionRate());
        });
        
        // Planes y cupones activos
        stats.setPlans(subscriptionPlanService.getAllActivePlans());
        stats.setActiveCoupons(discountCouponService.getValidCoupons());
        
        // Suscripciones próximas a expirar
        stats.setExpiringSubscriptions(userSubscriptionService.getExpiringSubscriptions(7));
        
        // Pagos recientes (últimos 10)
        stats.setRecentPayments(paymentHistoryService.getRecentPayments(10));
        
        return stats;
    }
    
    public SubscriptionSummaryDTO getSubscriptionSummary() {
        SubscriptionSummaryDTO summary = new SubscriptionSummaryDTO();
        
        summary.setMonthlyRevenue(paymentHistoryService.getMonthlyRevenue());
        
        // Obtener métricas más recientes
        subscriptionMetricsService.getLatestMetrics().ifPresent(metrics -> {
            summary.setActiveSubscriptions(metrics.getActiveSubscriptions());
            summary.setGrowthRate(metrics.getGrowthRate());
            summary.setRetentionRate(metrics.getRetentionRate());
            summary.setChurnRate(metrics.getChurnRate());
            summary.setNewSubscriptions(metrics.getNewSubscriptions());
            summary.setCancelledSubscriptions(metrics.getCancelledSubscriptions());
        });
        
        return summary;
    }
    
    public List<SubscriptionMetricsDTO> getMetricsHistory(int days) {
        return subscriptionMetricsService.getMetricsForLastDays(days);
    }
}