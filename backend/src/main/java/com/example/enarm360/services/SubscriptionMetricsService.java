package com.example.enarm360.services;

import com.example.enarm360.dtos.SubscriptionMetricsDTO;
import com.example.enarm360.entities.SubscriptionMetrics;
import com.example.enarm360.Mappers.SubscriptionMetricsMapper;
import com.example.enarm360.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SubscriptionMetricsService {
    
    private final SubscriptionMetricsRepository metricsRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionMetricsMapper metricsMapper;
    
    public void generateDailyMetrics() {
        LocalDate today = LocalDate.now();
        
        // Verificar si ya existen métricas para hoy
        if (metricsRepository.findByMetricDate(today).isPresent()) {
            log.info("Las métricas para {} ya existen, actualizando...", today);
        }
        
        SubscriptionMetrics metrics = calculateMetricsForDate(today);
        metricsRepository.save(metrics);
        
        log.info("Métricas generadas para {}: Revenue=${}, Active={}, New={}, Cancelled={}", 
                today, metrics.getTotalRevenue(), metrics.getActiveSubscriptions(), 
                metrics.getNewSubscriptions(), metrics.getCancelledSubscriptions());
    }
    
    private SubscriptionMetrics calculateMetricsForDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        SubscriptionMetrics metrics = new SubscriptionMetrics();
        metrics.setMetricDate(date);
        
        // Revenue del día
        BigDecimal dailyRevenue = paymentHistoryRepository.getRevenueBeteen(startOfDay, endOfDay);
        metrics.setTotalRevenue(dailyRevenue);
        
        // Suscripciones activas al final del día
        Integer activeSubscriptions = subscriptionRepository.countActiveSubscriptions();
        metrics.setActiveSubscriptions(activeSubscriptions);
        
        // Nuevas suscripciones del día
        Integer newSubscriptions = subscriptionRepository.countNewSubscriptionsSince(startOfDay);
        metrics.setNewSubscriptions(newSubscriptions);
        
        // Suscripciones canceladas del día
        Integer cancelledSubscriptions = subscriptionRepository.countCancelledSubscriptionsSince(startOfDay);
        metrics.setCancelledSubscriptions(cancelledSubscriptions);
        
        // Calcular tasas
        Optional<SubscriptionMetrics> previousMetrics = metricsRepository.findByMetricDate(date.minusDays(1));
        if (previousMetrics.isPresent()) {
            Integer previousActive = previousMetrics.get().getActiveSubscriptions();
            
            // Growth rate
            if (previousActive > 0) {
                BigDecimal growthRate = BigDecimal.valueOf(activeSubscriptions - previousActive)
                        .divide(BigDecimal.valueOf(previousActive), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
                metrics.setGrowthRate(growthRate);
            }
            
            // Churn rate (cancelaciones / suscripciones activas al inicio del día)
            if (previousActive > 0) {
                BigDecimal churnRate = BigDecimal.valueOf(cancelledSubscriptions)
                        .divide(BigDecimal.valueOf(previousActive), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
                metrics.setChurnRate(churnRate);
            }
            
            // Retention rate = 100 - churn rate
            metrics.setRetentionRate(BigDecimal.valueOf(100).subtract(metrics.getChurnRate()));
        }
        
        // Métricas por plan
        Map<String, Object> planMetrics = calculatePlanMetrics(startOfDay, endOfDay);
        metrics.setPlanMetrics(planMetrics);
        
        return metrics;
    }
    
    private Map<String, Object> calculatePlanMetrics(LocalDateTime startOfDay, LocalDateTime endOfDay) {
        Map<String, Object> planMetrics = new HashMap<>();
        
        planRepository.findAll().forEach(plan -> {
            Map<String, Object> planData = new HashMap<>();
            
            // Suscripciones activas por plan
            Integer activeSubscriptions = planRepository.countActiveSubscriptionsByPlan(plan.getId());
            planData.put("activeSubscriptions", activeSubscriptions);
            
            // Revenue por plan
            BigDecimal revenue = planRepository.getTotalRevenueByPlan(plan.getId());
            planData.put("totalRevenue", revenue);
            
            // Nuevas suscripciones del día para este plan
            planData.put("newSubscriptions", 0); // Placeholder - implementar query específico
            
            planMetrics.put(plan.getName(), planData);
        });
        
        return planMetrics;
    }
    
    @Transactional(readOnly = true)
    public List<SubscriptionMetricsDTO> getMetricsBetween(LocalDate start, LocalDate end) {
        List<SubscriptionMetrics> metrics = metricsRepository.findMetricsBetween(start, end);
        return metrics.stream()
                .map(metricsMapper::toDTO)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public Optional<SubscriptionMetricsDTO> getLatestMetrics() {
        return metricsRepository.findLatestMetrics()
                .map(metricsMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public List<SubscriptionMetricsDTO> getMetricsForLastDays(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        List<SubscriptionMetrics> metrics = metricsRepository.findMetricsSince(startDate);
        return metrics.stream()
                .map(metricsMapper::toDTO)
                .toList();
    }
}