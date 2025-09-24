package com.example.enarm360.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateCouponDTO {
    
    @NotBlank(message = "Código del cupón es requerido")
    private String couponCode;
    
    @NotNull(message = "ID del plan es requerido")
    private Long planId;
    
    @NotNull(message = "Monto es requerido")
    private BigDecimal amount;
}