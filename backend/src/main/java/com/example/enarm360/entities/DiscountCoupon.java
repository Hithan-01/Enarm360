package com.example.enarm360.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "discount_coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCoupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;
    
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    
    @Column(length = 3)
    private String currency = "USD";
    
    @Column(name = "min_amount", precision = 10, scale = 2)
    private BigDecimal minAmount;
    
    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;
    
    @Column(name = "usage_limit")
    private Integer usageLimit;
    
    @Column(name = "usage_limit_per_user")
    private Integer usageLimitPerUser = 1;
    
    @Column(name = "current_usage")
    private Integer currentUsage = 0;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "applicable_plans", columnDefinition = "jsonb")
    private List<Long> applicablePlans;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CouponUsage> usages;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return isActive && 
               (startDate == null || startDate.isBefore(now)) &&
               (expirationDate == null || expirationDate.isAfter(now)) &&
               (usageLimit == null || currentUsage < usageLimit);
    }
    
    public boolean isApplicableToPlans(Long planId) {
        return applicablePlans == null || applicablePlans.contains(planId);
    }
    
    public enum DiscountType {
        PERCENTAGE, FIXED_AMOUNT
    }
}