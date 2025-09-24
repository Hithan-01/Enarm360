package com.example.enarm360.services;

import com.example.enarm360.dtos.CreateSubscriptionDTO;
import com.example.enarm360.dtos.UserSubscriptionDTO;
import com.example.enarm360.entities.*;
import com.example.enarm360.Mappers.UserSubscriptionMapper;
import com.example.enarm360.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserSubscriptionService {
    
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UsuarioRepository usuarioRepository;
    private final DiscountCouponService discountCouponService;
    private final PaymentHistoryService paymentHistoryService;
    private final UserSubscriptionMapper userSubscriptionMapper;
    
    @Transactional(readOnly = true)
    public Optional<UserSubscriptionDTO> getCurrentSubscription(Long userId) {
        return userSubscriptionRepository.findActiveSubscriptionByUser(userId, LocalDateTime.now())
                .map(userSubscriptionMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public List<UserSubscriptionDTO> getUserSubscriptionHistory(Long userId) {
        List<UserSubscription> subscriptions = userSubscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return subscriptions.stream()
                .map(userSubscriptionMapper::toDTO)
                .toList();
    }
    
    public UserSubscriptionDTO createSubscription(CreateSubscriptionDTO createDTO) {
        // Validar usuario
        Usuario user = usuarioRepository.findById(createDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar plan
        SubscriptionPlan plan = subscriptionPlanRepository.findById(createDTO.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        
        if (!plan.getIsActive()) {
            throw new RuntimeException("El plan seleccionado no está disponible");
        }
        
        // Verificar si ya tiene una suscripción activa
        Optional<UserSubscription> existingSubscription = userSubscriptionRepository
                .findActiveSubscriptionByUser(createDTO.getUserId(), LocalDateTime.now());
        
        if (existingSubscription.isPresent()) {
            throw new RuntimeException("El usuario ya tiene una suscripción activa");
        }
        
        // Calcular fechas
        LocalDateTime startDate = createDTO.getStartDate() != null ? createDTO.getStartDate() : LocalDateTime.now();
        LocalDateTime endDate = calculateEndDate(startDate, plan.getBillingInterval());
        
        // Calcular precio con descuento si hay cupón
        BigDecimal finalPrice = plan.getPrice();
        CouponUsage couponUsage = null;
        
        if (createDTO.getCouponCode() != null && !createDTO.getCouponCode().trim().isEmpty()) {
            couponUsage = discountCouponService.applyCoupon(createDTO.getCouponCode(), 
                    createDTO.getUserId(), plan.getPrice(), createDTO.getPlanId());
            finalPrice = couponUsage.getFinalAmount();
        }
        
        // Crear suscripción
        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStatus(UserSubscription.SubscriptionStatus.ACTIVE);
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);
        subscription.setPaymentMethod(createDTO.getPaymentMethod());
        subscription.setPaymentReference(createDTO.getPaymentReference());
        
        UserSubscription savedSubscription = userSubscriptionRepository.save(subscription);
        
        // Asociar cupón a la suscripción si se usó
        if (couponUsage != null) {
            couponUsage.setSubscription(savedSubscription);
            discountCouponService.saveCouponUsage(couponUsage);
        }
        
        // Actualizar usuario
        user.setCurrentSubscription(savedSubscription);
        user.setSubscriptionStatus(mapToUserSubscriptionStatus(plan.getName()));
        usuarioRepository.save(user);
        
        // Registrar pago
        if (finalPrice.compareTo(BigDecimal.ZERO) > 0) {
            paymentHistoryService.recordPayment(savedSubscription, finalPrice, 
                    createDTO.getPaymentMethod(), createDTO.getPaymentReference());
        }
        
        log.info("Suscripción creada para usuario {} al plan {}", user.getEmail(), plan.getName());
        
        return userSubscriptionMapper.toDTO(savedSubscription);
    }
    
    public UserSubscriptionDTO cancelSubscription(Long subscriptionId, Long userId) {
        UserSubscription subscription = userSubscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
        
        if (!subscription.getUser().getId().equals(userId)) {
            throw new RuntimeException("No autorizado para cancelar esta suscripción");
        }
        
        if (subscription.getStatus() != UserSubscription.SubscriptionStatus.ACTIVE) {
            throw new RuntimeException("La suscripción ya no está activa");
        }
        
        subscription.setStatus(UserSubscription.SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        // No cambiar endDate para permitir que termine el período pagado
        
        UserSubscription savedSubscription = userSubscriptionRepository.save(subscription);
        
        // Actualizar usuario si esta era su suscripción actual
        Usuario user = subscription.getUser();
        if (user.getCurrentSubscription() != null && 
            user.getCurrentSubscription().getId().equals(subscriptionId)) {
            user.setSubscriptionStatus(Usuario.SubscriptionStatus.CANCELLED);
            usuarioRepository.save(user);
        }
        
        log.info("Suscripción cancelada para usuario {}", user.getEmail());
        
        return userSubscriptionMapper.toDTO(savedSubscription);
    }
    
    public UserSubscriptionDTO renewSubscription(Long subscriptionId) {
        UserSubscription subscription = userSubscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
        
        if (!subscription.getAutoRenew()) {
            throw new RuntimeException("La suscripción no tiene renovación automática habilitada");
        }
        
        if (subscription.getStatus() != UserSubscription.SubscriptionStatus.ACTIVE) {
            throw new RuntimeException("Solo se pueden renovar suscripciones activas");
        }
        
        // Extender fecha de vencimiento
        LocalDateTime newEndDate = calculateEndDate(subscription.getEndDate(), 
                subscription.getPlan().getBillingInterval());
        subscription.setEndDate(newEndDate);
        
        UserSubscription savedSubscription = userSubscriptionRepository.save(subscription);
        
        // Registrar pago por renovación
        paymentHistoryService.recordPayment(savedSubscription, subscription.getPlan().getPrice(),
                subscription.getPaymentMethod(), "AUTO_RENEWAL_" + System.currentTimeMillis());
        
        log.info("Suscripción renovada para usuario {}", subscription.getUser().getEmail());
        
        return userSubscriptionMapper.toDTO(savedSubscription);
    }
    
    @Transactional(readOnly = true)
    public List<UserSubscriptionDTO> getExpiringSubscriptions(int daysAhead) {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(daysAhead);
        
        List<UserSubscription> expiring = userSubscriptionRepository
                .findSubscriptionsExpiringBetween(start, end);
        
        return expiring.stream()
                .map(userSubscriptionMapper::toDTO)
                .toList();
    }
    
    public void processExpiredSubscriptions() {
        List<UserSubscription> expired = userSubscriptionRepository
                .findExpiredActiveSubscriptions(LocalDateTime.now());
        
        for (UserSubscription subscription : expired) {
            subscription.setStatus(UserSubscription.SubscriptionStatus.EXPIRED);
            
            // Actualizar usuario
            Usuario user = subscription.getUser();
            if (user.getCurrentSubscription() != null && 
                user.getCurrentSubscription().getId().equals(subscription.getId())) {
                user.setCurrentSubscription(null);
                user.setSubscriptionStatus(Usuario.SubscriptionStatus.EXPIRED);
                usuarioRepository.save(user);
            }
            
            userSubscriptionRepository.save(subscription);
            log.info("Suscripción expirada para usuario {}", user.getEmail());
        }
    }
    
    private LocalDateTime calculateEndDate(LocalDateTime startDate, SubscriptionPlan.BillingInterval interval) {
        return switch (interval) {
            case MONTHLY -> startDate.plusMonths(1);
            case YEARLY -> startDate.plusYears(1);
        };
    }
    
    private Usuario.SubscriptionStatus mapToUserSubscriptionStatus(String planName) {
        return switch (planName.toLowerCase()) {
            case "free trial" -> Usuario.SubscriptionStatus.TRIAL;
            case "standard" -> Usuario.SubscriptionStatus.STANDARD;
            case "premium" -> Usuario.SubscriptionStatus.PREMIUM;
            default -> Usuario.SubscriptionStatus.FREE;
        };
    }
}