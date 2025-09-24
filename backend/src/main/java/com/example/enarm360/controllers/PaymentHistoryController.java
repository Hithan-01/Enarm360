package com.example.enarm360.controllers;

import com.example.enarm360.dtos.PaymentHistoryDTO;
import com.example.enarm360.services.PaymentHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-history")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentHistoryController {
    
    private final PaymentHistoryService paymentHistoryService;
    
    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('ADMIN')")
    public ResponseEntity<List<PaymentHistoryDTO>> getMyPaymentHistory(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        List<PaymentHistoryDTO> payments = paymentHistoryService.getUserPaymentHistory(userId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentHistoryDTO>> getUserPaymentHistory(@PathVariable Long userId) {
        List<PaymentHistoryDTO> payments = paymentHistoryService.getUserPaymentHistory(userId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/subscription/{subscriptionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentHistoryDTO>> getSubscriptionPaymentHistory(
            @PathVariable Long subscriptionId) {
        List<PaymentHistoryDTO> payments = paymentHistoryService.getSubscriptionPaymentHistory(subscriptionId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentHistoryDTO>> getRecentPayments(
            @RequestParam(defaultValue = "10") int limit) {
        List<PaymentHistoryDTO> payments = paymentHistoryService.getRecentPayments(limit);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/revenue/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getTotalRevenue() {
        BigDecimal totalRevenue = paymentHistoryService.getTotalRevenue();
        return ResponseEntity.ok(Map.of("totalRevenue", totalRevenue));
    }
    
    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyRevenue() {
        BigDecimal monthlyRevenue = paymentHistoryService.getMonthlyRevenue();
        return ResponseEntity.ok(Map.of("monthlyRevenue", monthlyRevenue));
    }
    
    @GetMapping("/revenue/between")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRevenueBetween(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            BigDecimal revenue = paymentHistoryService.getRevenueBetween(start, end);
            return ResponseEntity.ok(Map.of("revenue", revenue, "startDate", startDate, "endDate", endDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", BigDecimal.ZERO));
        }
    }
    
    private Long getUserIdFromAuth(Authentication auth) {
        return Long.valueOf(auth.getName()); // Ajustar según tu implementación JWT
    }
}
