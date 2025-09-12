package com.example.enarm360.repositories;

import com.example.enarm360.entities.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    
    List<UserSubscription> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<UserSubscription> findByUserIdAndStatus(Long userId, UserSubscription.SubscriptionStatus status);
    
    @Query("SELECT us FROM UserSubscription us WHERE us.user.id = :userId AND us.status = 'ACTIVE' AND (us.endDate IS NULL OR us.endDate > :now)")
    Optional<UserSubscription> findActiveSubscriptionByUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT us FROM UserSubscription us WHERE us.status = 'ACTIVE' AND us.endDate IS NOT NULL AND us.endDate BETWEEN :start AND :end")
    List<UserSubscription> findSubscriptionsExpiringBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(us) FROM UserSubscription us WHERE us.status = 'ACTIVE'")
    Integer countActiveSubscriptions();
    
    @Query("SELECT COUNT(us) FROM UserSubscription us WHERE us.createdAt >= :startDate")
    Integer countNewSubscriptionsSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(us) FROM UserSubscription us WHERE us.status = 'CANCELLED' AND us.updatedAt >= :startDate")
    Integer countCancelledSubscriptionsSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT us FROM UserSubscription us WHERE us.endDate IS NOT NULL AND us.endDate <= :now AND us.status = 'ACTIVE'")
    List<UserSubscription> findExpiredActiveSubscriptions(@Param("now") LocalDateTime now);
    
    @Query("SELECT us FROM UserSubscription us WHERE us.plan.id = :planId AND us.status = 'ACTIVE'")
    List<UserSubscription> findActiveSubscriptionsByPlan(@Param("planId") Long planId);
}