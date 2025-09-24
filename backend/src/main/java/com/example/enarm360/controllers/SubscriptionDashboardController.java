package com.example.enarm360.controllers;

import com.example.enarm360.dtos.*;
import com.example.enarm360.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscription-dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionDashboardController {
    
    private final SubscriptionDashboardService dashboardService;
    private final UserSubscriptionService userSubscriptionService;
    private final SubscriptionMetricsService metricsService;
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionSummaryDTO> getSubscriptionSummary() {
        SubscriptionSummaryDTO summary = dashboardService.getSubscriptionSummary();
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/metrics/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SubscriptionMetricsDTO>> getMetricsHistory(
            @RequestParam(defaultValue = "30") int days) {
        List<SubscriptionMetricsDTO> metrics = dashboardService.getMetricsHistory(days);
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/metrics/latest")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionMetricsDTO> getLatestMetrics() {
        return metricsService.getLatestMetrics()
                .map(metrics -> ResponseEntity.ok(metrics))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/process-expired")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> processExpiredSubscriptions() {
        try {
            userSubscriptionService.processExpiredSubscriptions();
            return ResponseEntity.ok(Map.of("message", "Suscripciones expiradas procesadas exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al procesar suscripciones expiradas: " + e.getMessage()));
        }
    }
    
    @PostMapping("/generate-metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> generateDailyMetrics() {
        try {
            metricsService.generateDailyMetrics();
            return ResponseEntity.ok(Map.of("message", "Métricas diarias generadas exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al generar métricas: " + e.getMessage()));
        }
    }
}