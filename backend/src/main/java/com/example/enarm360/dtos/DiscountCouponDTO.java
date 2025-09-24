package com.example.enarm360.dtos;

import com.example.enarm360.entities.DiscountCoupon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCouponDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private DiscountCoupon.DiscountType discountType;
    private BigDecimal discountValue;
    private String currency;
    private BigDecimal minAmount;
    private BigDecimal maxDiscount; 
    private Integer usageLimit;
    private Integer usageLimitPerUser;
    private Integer currentUsage;
    private List<Long> applicablePlans;
    private LocalDateTime startDate;
    private LocalDateTime expirationDate;
    private Boolean isActive;
    private String createdByEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isValid;
    private Integer remainingUses;
}