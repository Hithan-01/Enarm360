package com.example.enarm360.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponUsageDTO {
    private Long id;
    private String couponCode;
    private String couponName;
    private Long userId;
    private String userEmail;
    private Long subscriptionId;
    private String planName;
    private LocalDateTime usedAt;
    private BigDecimal discountApplied;
    private BigDecimal originalAmount;
    private BigDecimal finalAmount;
}