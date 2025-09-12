package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "subscription_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionMetrics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "metric_date", nullable = false, unique = true)
    private LocalDate metricDate;
    
    @Column(name = "total_revenue", precision = 12, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    
    @Column(name = "active_subscriptions")
    private Integer activeSubscriptions = 0;
    
    @Column(name = "new_subscriptions")
    private Integer newSubscriptions = 0;
    
    @Column(name = "cancelled_subscriptions")
    private Integer cancelledSubscriptions = 0;
    
    @Column(name = "churn_rate", precision = 5, scale = 2)
    private BigDecimal churnRate = BigDecimal.ZERO;
    
    @Column(name = "growth_rate", precision = 5, scale = 2)
    private BigDecimal growthRate = BigDecimal.ZERO;
    
    @Column(name = "retention_rate", precision = 5, scale = 2)
    private BigDecimal retentionRate = BigDecimal.ZERO;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "plan_metrics", columnDefinition = "jsonb")
    private Map<String, Object> planMetrics;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}