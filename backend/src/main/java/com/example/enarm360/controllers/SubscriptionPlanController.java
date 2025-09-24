package com.example.enarm360.controllers;

import com.example.enarm360.dtos.CreateSubscriptionPlanDTO;
import com.example.enarm360.dtos.SubscriptionPlanDTO;
import com.example.enarm360.services.SubscriptionPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionPlanController {
    
    private final SubscriptionPlanService subscriptionPlanService;
    
    @GetMapping
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllActivePlans() {
        List<SubscriptionPlanDTO> plans = subscriptionPlanService.getAllActivePlans();
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllPlans() {
        List<SubscriptionPlanDTO> plans = subscriptionPlanService.getAllPlans();
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> getPlanById(@PathVariable Long id) {
        return subscriptionPlanService.getPlanById(id)
                .map(plan -> ResponseEntity.ok(plan))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-name/{name}")
    public ResponseEntity<SubscriptionPlanDTO> getPlanByName(@PathVariable String name) {
        return subscriptionPlanService.getPlanByName(name)
                .map(plan -> ResponseEntity.ok(plan))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPlan(@Valid @RequestBody CreateSubscriptionPlanDTO createDTO) {
        try {
            SubscriptionPlanDTO createdPlan = subscriptionPlanService.createPlan(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody CreateSubscriptionPlanDTO updateDTO) {
        try {
            SubscriptionPlanDTO updatedPlan = subscriptionPlanService.updatePlan(id, updateDTO);
            return ResponseEntity.ok(updatedPlan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activatePlan(@PathVariable Long id) {
        try {
            subscriptionPlanService.activatePlan(id);
            return ResponseEntity.ok(Map.of("message", "Plan activado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivatePlan(@PathVariable Long id) {
        try {
            subscriptionPlanService.deactivatePlan(id);
            return ResponseEntity.ok(Map.of("message", "Plan desactivado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePlan(@PathVariable Long id) {
        try {
            subscriptionPlanService.deletePlan(id);
            return ResponseEntity.ok(Map.of("message", "Plan eliminado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}