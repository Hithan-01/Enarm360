package com.example.enarm360.repositories;

import com.example.enarm360.entities.DiscountCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountCouponRepository extends JpaRepository<DiscountCoupon, Long> {
    
    Optional<DiscountCoupon> findByCodeIgnoreCase(String code);
    
    @Query("SELECT dc FROM DiscountCoupon dc WHERE dc.isActive = true AND " +
           "(dc.startDate IS NULL OR dc.startDate <= :now) AND " +
           "(dc.expirationDate IS NULL OR dc.expirationDate > :now) AND " +
           "(dc.usageLimit IS NULL OR dc.currentUsage < dc.usageLimit)")
    List<DiscountCoupon> findValidCoupons(@Param("now") LocalDateTime now);
    
    @Query("SELECT dc FROM DiscountCoupon dc WHERE dc.isActive = true AND " +
           "dc.code = :code AND " +
           "(dc.startDate IS NULL OR dc.startDate <= :now) AND " +
           "(dc.expirationDate IS NULL OR dc.expirationDate > :now) AND " +
           "(dc.usageLimit IS NULL OR dc.currentUsage < dc.usageLimit)")
    Optional<DiscountCoupon> findValidCouponByCode(@Param("code") String code, @Param("now") LocalDateTime now);
    
    List<DiscountCoupon> findByCreatedByIdOrderByCreatedAtDesc(Long createdById);
    
    @Query("SELECT dc FROM DiscountCoupon dc WHERE dc.expirationDate IS NOT NULL AND dc.expirationDate BETWEEN :start AND :end AND dc.isActive = true")
    List<DiscountCoupon> findCouponsExpiringBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
