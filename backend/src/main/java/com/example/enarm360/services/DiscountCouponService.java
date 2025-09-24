package com.example.enarm360.services;

import com.example.enarm360.dtos.CreateDiscountCouponDTO;
import com.example.enarm360.dtos.DiscountCouponDTO;
import com.example.enarm360.entities.CouponUsage;
import com.example.enarm360.entities.DiscountCoupon;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.Mappers.DiscountCouponMapper;
import com.example.enarm360.repositories.CouponUsageRepository;
import com.example.enarm360.repositories.DiscountCouponRepository;
import com.example.enarm360.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DiscountCouponService {
    
    private final DiscountCouponRepository discountCouponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final UsuarioRepository usuarioRepository;
    private final DiscountCouponMapper discountCouponMapper;
    
    @Transactional(readOnly = true)
    public List<DiscountCouponDTO> getAllCoupons() {
        return discountCouponRepository.findAll().stream()
                .map(discountCouponMapper::toDTO)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<DiscountCouponDTO> getValidCoupons() {
        return discountCouponRepository.findValidCoupons(LocalDateTime.now()).stream()
                .map(discountCouponMapper::toDTO)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public Optional<DiscountCouponDTO> getCouponById(Long id) {
        return discountCouponRepository.findById(id)
                .map(discountCouponMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Optional<DiscountCouponDTO> validateCoupon(String code, Long userId, Long planId) {
        Optional<DiscountCoupon> couponOpt = discountCouponRepository
                .findValidCouponByCode(code, LocalDateTime.now());
        
        if (couponOpt.isEmpty()) {
            return Optional.empty();
        }
        
        DiscountCoupon coupon = couponOpt.get();
        
        // Verificar si es aplicable al plan
        if (!coupon.isApplicableToPlans(planId)) {
            return Optional.empty();
        }
        
        // Verificar límite por usuario
        if (coupon.getUsageLimitPerUser() != null) {
            Integer userUsages = couponUsageRepository.countUsagesByCouponAndUser(coupon.getId(), userId);
            if (userUsages >= coupon.getUsageLimitPerUser()) {
                return Optional.empty();
            }
        }
        
        return Optional.of(discountCouponMapper.toDTO(coupon));
    }
    
    public CouponUsage applyCoupon(String code, Long userId, BigDecimal originalAmount, Long planId) {
        DiscountCoupon coupon = discountCouponRepository
                .findValidCouponByCode(code, LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException("Cupón no válido o expirado"));
        
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar aplicabilidad al plan
        if (!coupon.isApplicableToPlans(planId)) {
            throw new RuntimeException("Este cupón no es aplicable al plan seleccionado");
        }
        
        // Verificar límite por usuario
        if (coupon.getUsageLimitPerUser() != null) {
            Integer userUsages = couponUsageRepository.countUsagesByCouponAndUser(coupon.getId(), userId);
            if (userUsages >= coupon.getUsageLimitPerUser()) {
                throw new RuntimeException("Ya has usado este cupón el máximo número de veces permitido");
            }
        }
        
        // Verificar monto mínimo
        if (coupon.getMinAmount() != null && originalAmount.compareTo(coupon.getMinAmount()) < 0) {
            throw new RuntimeException("El monto mínimo para usar este cupón es $" + coupon.getMinAmount());
        }
        
        // Calcular descuento
        BigDecimal discountAmount = calculateDiscount(coupon, originalAmount);
        BigDecimal finalAmount = originalAmount.subtract(discountAmount);
        
        // Asegurar que el precio final no sea negativo
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
            discountAmount = originalAmount;
        }
        
        // Crear registro de uso
        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setOriginalAmount(originalAmount);
        usage.setDiscountApplied(discountAmount);
        usage.setFinalAmount(finalAmount);
        
        // Incrementar contador de uso del cupón
        coupon.setCurrentUsage(coupon.getCurrentUsage() + 1);
        discountCouponRepository.save(coupon);
        
        log.info("Cupón {} aplicado para usuario {}. Descuento: ${}", 
                code, user.getEmail(), discountAmount);
        
        return usage;
    }
    
    public void saveCouponUsage(CouponUsage couponUsage) {
        couponUsageRepository.save(couponUsage);
    }
    
    public DiscountCouponDTO createCoupon(CreateDiscountCouponDTO createDTO, Long createdById) {
        // Validar que no exista un cupón con el mismo código
        if (discountCouponRepository.findByCodeIgnoreCase(createDTO.getCode()).isPresent()) {
            throw new RuntimeException("Ya existe un cupón con el código: " + createDTO.getCode());
        }
        
        Usuario creator = usuarioRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));
        
        DiscountCoupon coupon = discountCouponMapper.toEntity(createDTO);
        coupon.setCreatedBy(creator);
        coupon.setIsActive(true);
        
        DiscountCoupon savedCoupon = discountCouponRepository.save(coupon);
        log.info("Cupón creado: {} por usuario {}", savedCoupon.getCode(), creator.getEmail());
        
        return discountCouponMapper.toDTO(savedCoupon);
    }
    
    public DiscountCouponDTO updateCoupon(Long id, CreateDiscountCouponDTO updateDTO) {
        DiscountCoupon existingCoupon = discountCouponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));
        
        // Validar código único (excluyendo el cupón actual)
        discountCouponRepository.findByCodeIgnoreCase(updateDTO.getCode())
                .ifPresent(coupon -> {
                    if (!coupon.getId().equals(id)) {
                        throw new RuntimeException("Ya existe otro cupón con el código: " + updateDTO.getCode());
                    }
                });
        
        discountCouponMapper.updateEntityFromDTO(updateDTO, existingCoupon);
        DiscountCoupon savedCoupon = discountCouponRepository.save(existingCoupon);
        
        log.info("Cupón actualizado: {}", savedCoupon.getCode());
        
        return discountCouponMapper.toDTO(savedCoupon);
    }
    
    public void deactivateCoupon(Long id) {
        DiscountCoupon coupon = discountCouponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));
        
        coupon.setIsActive(false);
        discountCouponRepository.save(coupon);
        
        log.info("Cupón desactivado: {}", coupon.getCode());
    }
    
    public void deleteCoupon(Long id) {
        DiscountCoupon coupon = discountCouponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));
        
        // Verificar que no tenga usos
        List<CouponUsage> usages = couponUsageRepository.findByCouponIdOrderByUsedAtDesc(id);
        if (!usages.isEmpty()) {
            throw new RuntimeException("No se puede eliminar el cupón porque ya ha sido usado");
        }
        
        discountCouponRepository.delete(coupon);
        log.info("Cupón eliminado: {}", coupon.getCode());
    }
    
    private BigDecimal calculateDiscount(DiscountCoupon coupon, BigDecimal amount) {
        BigDecimal discount;
        
        if (coupon.getDiscountType() == DiscountCoupon.DiscountType.PERCENTAGE) {
            discount = amount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            
            // Aplicar descuento máximo si está configurado
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }
        
        return discount;
    }
}