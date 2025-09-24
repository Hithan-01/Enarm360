package com.example.enarm360.repositories;

import com.example.enarm360.entities.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    
    List<PaymentHistory> findByUserIdOrderByPaymentDateDesc(Long userId);
    
    List<PaymentHistory> findBySubscriptionIdOrderByPaymentDateDesc(Long subscriptionId);
    
    @Query("SELECT COALESCE(SUM(ph.amount), 0) FROM PaymentHistory ph WHERE ph.status = 'COMPLETED' AND ph.paymentDate >= :startDate")
    BigDecimal getTotalRevenueSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COALESCE(SUM(ph.amount), 0) FROM PaymentHistory ph WHERE ph.status = 'COMPLETED' AND ph.paymentDate BETWEEN :start AND :end")
    BigDecimal getRevenueBeteen(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.paymentDate BETWEEN :start AND :end ORDER BY ph.paymentDate DESC")
    List<PaymentHistory> findPaymentsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(ph) FROM PaymentHistory ph WHERE ph.status = 'COMPLETED' AND ph.paymentDate >= :startDate")
    Integer countSuccessfulPaymentsSince(@Param("startDate") LocalDateTime startDate);
}