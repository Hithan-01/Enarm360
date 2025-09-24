package com.example.enarm360.repositories;

import com.example.enarm360.entities.SubscriptionMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionMetricsRepository extends JpaRepository<SubscriptionMetrics, Long> {
    
    Optional<SubscriptionMetrics> findByMetricDate(LocalDate date);
    
    @Query("SELECT sm FROM SubscriptionMetrics sm WHERE sm.metricDate BETWEEN :start AND :end ORDER BY sm.metricDate ASC")
    List<SubscriptionMetrics> findMetricsBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
    
    @Query("SELECT sm FROM SubscriptionMetrics sm ORDER BY sm.metricDate DESC")
    List<SubscriptionMetrics> findAllOrderByDateDesc();
    
    @Query("SELECT sm FROM SubscriptionMetrics sm WHERE sm.metricDate >= :startDate ORDER BY sm.metricDate ASC")
    List<SubscriptionMetrics> findMetricsSince(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT sm FROM SubscriptionMetrics sm ORDER BY sm.metricDate DESC LIMIT 1")
    Optional<SubscriptionMetrics> findLatestMetrics();
}