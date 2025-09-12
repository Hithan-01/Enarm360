package com.example.enarm360.repositories;

import com.example.enarm360.entities.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    
    List<CouponUsage> findByCouponIdOrderByUsedAtDesc(Long couponId);
    
    List<CouponUsage> findByUserIdOrderByUsedAtDesc(Long userId);
    
    @Query("SELECT COUNT(cu) FROM CouponUsage cu WHERE cu.coupon.id = :couponId AND cu.user.id = :userId")
    Integer countUsagesByCouponAndUser(@Param("couponId") Long couponId, @Param("userId") Long userId);
    
    @Query("SELECT cu FROM CouponUsage cu WHERE cu.coupon.code = :couponCode AND cu.user.id = :userId")
    List<CouponUsage> findByCodeAndUser(@Param("couponCode") String couponCode, @Param("userId") Long userId);
    
    boolean existsByCouponIdAndUserId(Long couponId, Long userId);
}