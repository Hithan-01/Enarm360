package com.example.enarm360.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionMetricsDTO {
    private Long id;
    private LocalDate metricDate;
    private BigDecimal totalRevenue;
    private Integer activeSubscriptions;
    private Integer newSubscriptions;
    private Integer cancelledSubscriptions;
    private BigDecimal churnRate;
    private BigDecimal growthRate;
    private BigDecimal retentionRate;
    private Map<String, Object> planMetrics;
}