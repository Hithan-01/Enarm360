package com.example.enarm360.controllers;

import com.example.enarm360.dtos.*;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.repositories.UsuarioRepository;
import com.example.enarm360.security.UserDetailsImpl;
import com.example.enarm360.services.DiscountCouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiscountCouponController {
    
    private final DiscountCouponService discountCouponService;
    private final UsuarioRepository usuarioRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DiscountCouponDTO>> getAllCoupons() {
        List<DiscountCouponDTO> coupons = discountCouponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }
    
    @GetMapping("/valid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DiscountCouponDTO>> getValidCoupons() {
        List<DiscountCouponDTO> coupons = discountCouponService.getValidCoupons();
        return ResponseEntity.ok(coupons);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DiscountCouponDTO> getCouponById(@PathVariable Long id) {
        return discountCouponService.getCouponById(id)
                .map(coupon -> ResponseEntity.ok(coupon))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResultDTO> validateCoupon(
            @Valid @RequestBody ValidateCouponDTO validateDTO,
            Authentication auth) {
        
        Long userId = getUserIdFromAuth(auth);
        
        try {
            var couponOpt = discountCouponService.validateCoupon(
                    validateDTO.getCouponCode(), 
                    userId, 
                    validateDTO.getPlanId()
            );
            
            if (couponOpt.isEmpty()) {
                CouponValidationResultDTO result = new CouponValidationResultDTO();
                result.setIsValid(false);
                result.setMessage("Cupón no válido, expirado o no aplicable");
                return ResponseEntity.ok(result);
            }
            
            DiscountCouponDTO coupon = couponOpt.get();
            
            // Simular aplicación del descuento
            BigDecimal discountAmount = calculateDiscountAmount(coupon, validateDTO.getAmount());
            BigDecimal finalAmount = validateDTO.getAmount().subtract(discountAmount);
            
            if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
                finalAmount = BigDecimal.ZERO;
                discountAmount = validateDTO.getAmount();
            }
            
            CouponValidationResultDTO result = new CouponValidationResultDTO();
            result.setIsValid(true);
            result.setMessage("Cupón válido - Descuento aplicado");
            result.setOriginalAmount(validateDTO.getAmount());
            result.setDiscountAmount(discountAmount);
            result.setFinalAmount(finalAmount);
            result.setDiscountType(coupon.getDiscountType().toString());
            result.setDiscountValue(coupon.getDiscountValue());
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            CouponValidationResultDTO result = new CouponValidationResultDTO();
            result.setIsValid(false);
            result.setMessage("Error al validar cupón: " + e.getMessage());
            return ResponseEntity.ok(result);
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCoupon(
            @Valid @RequestBody CreateDiscountCouponDTO createDTO,
            Authentication auth) {
        try {
            Long createdById = getUserIdFromAuth(auth);
            DiscountCouponDTO coupon = discountCouponService.createCoupon(createDTO, createdById);
            return ResponseEntity.status(HttpStatus.CREATED).body(coupon);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CreateDiscountCouponDTO updateDTO) {
        try {
            DiscountCouponDTO coupon = discountCouponService.updateCoupon(id, updateDTO);
            return ResponseEntity.ok(coupon);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateCoupon(@PathVariable Long id) {
        try {
            discountCouponService.deactivateCoupon(id);
            return ResponseEntity.ok(Map.of("message", "Cupón desactivado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        try {
            discountCouponService.deleteCoupon(id);
            return ResponseEntity.ok(Map.of("message", "Cupón eliminado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Métodos de utilidad
    private Long getUserIdFromAuth(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetailsImpl udi) {
            return udi.getId();
        }
        // Fallback: usar username/email de auth.getName() para buscar el ID
        String login = auth.getName(); // puede ser username o email
        return usuarioRepository.findByUsernameOrEmail(login, login)
                .map(Usuario::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para: " + login));
    }
    
    private BigDecimal calculateDiscountAmount(DiscountCouponDTO coupon, BigDecimal amount) {
        if (coupon.getDiscountType().toString().equals("PERCENTAGE")) {
            BigDecimal discount = amount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
            
            return discount;
        } else {
            return coupon.getDiscountValue();
        }
    }
}
