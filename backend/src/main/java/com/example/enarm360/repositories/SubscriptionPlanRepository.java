package com.example.enarm360.repositories;

import com.example.enarm360.entities.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    
    List<SubscriptionPlan> findByIsActiveTrue();
    
    Optional<SubscriptionPlan> findByNameIgnoreCase(String name);
    
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true ORDER BY sp.price ASC")
    List<SubscriptionPlan> findActivePlansOrderByPrice();
    
    @Query("SELECT COUNT(us) FROM UserSubscription us WHERE us.plan.id = :planId AND us.status = 'ACTIVE'")
    Integer countActiveSubscriptionsByPlan(Long planId);
    
    @Query("SELECT COALESCE(SUM(ph.amount), 0) FROM PaymentHistory ph WHERE ph.subscription.plan.id = :planId AND ph.status = 'COMPLETED'")
    java.math.BigDecimal getTotalRevenueByPlan(Long planId);
}