package com.example.enarm360.services;

import com.example.enarm360.dtos.PaymentHistoryDTO;
import com.example.enarm360.entities.PaymentHistory;
import com.example.enarm360.entities.UserSubscription;
import com.example.enarm360.Mappers.PaymentHistoryMapper;
import com.example.enarm360.repositories.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentHistoryService {
    
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentHistoryMapper paymentHistoryMapper;
    
    @Transactional(readOnly = true)
    public List<PaymentHistoryDTO> getUserPaymentHistory(Long userId) {
        List<PaymentHistory> payments = paymentHistoryRepository.findByUserIdOrderByPaymentDateDesc(userId);
        return payments.stream()
                .map(paymentHistoryMapper::toDTO)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<PaymentHistoryDTO> getSubscriptionPaymentHistory(Long subscriptionId) {
        List<PaymentHistory> payments = paymentHistoryRepository.findBySubscriptionIdOrderByPaymentDateDesc(subscriptionId);
        return payments.stream()
                .map(paymentHistoryMapper::toDTO)
                .toList();
    }
    
    public PaymentHistory recordPayment(UserSubscription subscription, BigDecimal amount, 
                                      String paymentMethod, String paymentReference) {
        PaymentHistory payment = new PaymentHistory();
        payment.setSubscription(subscription);
        payment.setUser(subscription.getUser());
        payment.setAmount(amount);
        payment.setCurrency(subscription.getPlan().getCurrency());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentReference(paymentReference);
        payment.setStatus(PaymentHistory.PaymentStatus.COMPLETED);
        payment.setDescription("Pago de suscripción: " + subscription.getPlan().getName());
        
        PaymentHistory savedPayment = paymentHistoryRepository.save(payment);
        log.info("Pago registrado: ${} para suscripción {}", amount, subscription.getId());
        
        return savedPayment;
    }
    
    public PaymentHistory recordFailedPayment(UserSubscription subscription, BigDecimal amount,
                                            String paymentMethod, String error) {
        PaymentHistory payment = new PaymentHistory();
        payment.setSubscription(subscription);
        payment.setUser(subscription.getUser());
        payment.setAmount(amount);
        payment.setCurrency(subscription.getPlan().getCurrency());
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus(PaymentHistory.PaymentStatus.FAILED);
        payment.setDescription("Pago fallido: " + error);
        payment.setMetadata(Map.of("error", error));
        
        PaymentHistory savedPayment = paymentHistoryRepository.save(payment);
        log.warn("Pago fallido registrado: ${} para suscripción {}", amount, subscription.getId());
        
        return savedPayment;
    }
    
    @Transactional(readOnly = true)
    public BigDecimal getTotalRevenue() {
        return paymentHistoryRepository.getTotalRevenueSince(LocalDateTime.of(2020, 1, 1, 0, 0));
    }
    
    @Transactional(readOnly = true)
    public BigDecimal getMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return paymentHistoryRepository.getTotalRevenueSince(startOfMonth);
    }
    
    @Transactional(readOnly = true)
    public BigDecimal getRevenueBetween(LocalDateTime start, LocalDateTime end) {
        return paymentHistoryRepository.getRevenueBeteen(start, end);
    }
    
    @Transactional(readOnly = true)
    public List<PaymentHistoryDTO> getRecentPayments(int limit) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<PaymentHistory> payments = paymentHistoryRepository.findPaymentsBetween(
                thirtyDaysAgo, LocalDateTime.now());
        
        return payments.stream()
                .limit(limit)
                .map(paymentHistoryMapper::toDTO)
                .toList();
    }
}