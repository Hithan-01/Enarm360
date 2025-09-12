package com.example.enarm360.dtos;

import com.example.enarm360.entities.PaymentHistory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistoryDTO {
    private Long id;
    private Long subscriptionId;
    private Long userId;
    private String userEmail;
    private String planName;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String paymentReference;
    private LocalDateTime paymentDate;
    private PaymentHistory.PaymentStatus status;
    private String description;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
}