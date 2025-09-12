package com.example.enarm360.services;

import com.example.enarm360.dtos.CreateSubscriptionPlanDTO;
import com.example.enarm360.dtos.SubscriptionPlanDTO;
import com.example.enarm360.entities.SubscriptionPlan;
import com.example.enarm360.Mappers.SubscriptionPlanMapper;
import com.example.enarm360.repositories.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SubscriptionPlanService {
    
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    
    @Transactional(readOnly = true)
    public List<SubscriptionPlanDTO> getAllActivePlans() {
        List<SubscriptionPlan> plans = subscriptionPlanRepository.findActivePlansOrderByPrice();
        return plans.stream()
                .map(plan -> {
                    SubscriptionPlanDTO dto = subscriptionPlanMapper.toDTO(plan);
                    // Agregar estadísticas
                    dto.setSubscribersCount(subscriptionPlanRepository.countActiveSubscriptionsByPlan(plan.getId()));
                    dto.setTotalRevenue(subscriptionPlanRepository.getTotalRevenueByPlan(plan.getId()));
                    return dto;
                })
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<SubscriptionPlanDTO> getAllPlans() {
        List<SubscriptionPlan> plans = subscriptionPlanRepository.findAll();
        return plans.stream()
                .map(plan -> {
                    SubscriptionPlanDTO dto = subscriptionPlanMapper.toDTO(plan);
                    dto.setSubscribersCount(subscriptionPlanRepository.countActiveSubscriptionsByPlan(plan.getId()));
                    dto.setTotalRevenue(subscriptionPlanRepository.getTotalRevenueByPlan(plan.getId()));
                    return dto;
                })
                .toList();
    }
    
    @Transactional(readOnly = true)
    public Optional<SubscriptionPlanDTO> getPlanById(Long id) {
        return subscriptionPlanRepository.findById(id)
                .map(plan -> {
                    SubscriptionPlanDTO dto = subscriptionPlanMapper.toDTO(plan);
                    dto.setSubscribersCount(subscriptionPlanRepository.countActiveSubscriptionsByPlan(plan.getId()));
                    dto.setTotalRevenue(subscriptionPlanRepository.getTotalRevenueByPlan(plan.getId()));
                    return dto;
                });
    }
    
    @Transactional(readOnly = true)
    public Optional<SubscriptionPlanDTO> getPlanByName(String name) {
        return subscriptionPlanRepository.findByNameIgnoreCase(name)
                .map(subscriptionPlanMapper::toDTO);
    }
    
    public SubscriptionPlanDTO createPlan(CreateSubscriptionPlanDTO createDTO) {
        // Validar que no exista un plan con el mismo nombre
        if (subscriptionPlanRepository.findByNameIgnoreCase(createDTO.getName()).isPresent()) {
            throw new RuntimeException("Ya existe un plan con el nombre: " + createDTO.getName());
        }
        
        SubscriptionPlan plan = subscriptionPlanMapper.toEntity(createDTO);
        plan.setIsActive(true);
        
        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(plan);
        log.info("Plan de suscripción creado: {} - ${}", savedPlan.getName(), savedPlan.getPrice());
        
        return subscriptionPlanMapper.toDTO(savedPlan);
    }
    
    public SubscriptionPlanDTO updatePlan(Long id, CreateSubscriptionPlanDTO updateDTO) {
        SubscriptionPlan existingPlan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con ID: " + id));
        
        // Validar nombre único (excluyendo el plan actual)
        subscriptionPlanRepository.findByNameIgnoreCase(updateDTO.getName())
                .ifPresent(plan -> {
                    if (!plan.getId().equals(id)) {
                        throw new RuntimeException("Ya existe otro plan con el nombre: " + updateDTO.getName());
                    }
                });
        
        subscriptionPlanMapper.updateEntityFromDTO(updateDTO, existingPlan);
        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(existingPlan);
        
        log.info("Plan de suscripción actualizado: {} - ${}", savedPlan.getName(), savedPlan.getPrice());
        
        return subscriptionPlanMapper.toDTO(savedPlan);
    }
    
    public void deactivatePlan(Long id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con ID: " + id));
        
        plan.setIsActive(false);
        subscriptionPlanRepository.save(plan);
        
        log.info("Plan de suscripción desactivado: {}", plan.getName());
    }
    
    public void activatePlan(Long id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con ID: " + id));
        
        plan.setIsActive(true);
        subscriptionPlanRepository.save(plan);
        
        log.info("Plan de suscripción activado: {}", plan.getName());
    }
    
    public void deletePlan(Long id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con ID: " + id));
        
        // Verificar que no tenga suscripciones activas
        Integer activeSubscriptions = subscriptionPlanRepository.countActiveSubscriptionsByPlan(id);
        if (activeSubscriptions > 0) {
            throw new RuntimeException("No se puede eliminar el plan porque tiene " + activeSubscriptions + " suscripciones activas");
        }
        
        subscriptionPlanRepository.delete(plan);
        log.info("Plan de suscripción eliminado: {}", plan.getName());
    }
}
