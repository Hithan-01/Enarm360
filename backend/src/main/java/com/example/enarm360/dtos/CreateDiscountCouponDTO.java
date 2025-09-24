package com.example.enarm360.dtos;

import com.example.enarm360.entities.DiscountCoupon;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiscountCouponDTO {
    
    @NotBlank(message = "Código del cupón es requerido")
    @Size(max = 50, message = "El código no puede exceder 50 caracteres")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "El código solo puede contener letras mayúsculas y números")
    private String code;
    
    @NotBlank(message = "Nombre del cupón es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;
    
    @NotNull(message = "Tipo de descuento es requerido")
    private DiscountCoupon.DiscountType discountType;
    
    @NotNull(message = "Valor del descuento es requerido")
    @DecimalMin(value = "0.01", message = "El valor del descuento debe ser mayor a 0")
    private BigDecimal discountValue;
    
    @Pattern(regexp = "USD|MXN|EUR", message = "Moneda debe ser USD, MXN o EUR")
    private String currency = "USD";
    
    @DecimalMin(value = "0", message = "El monto mínimo no puede ser negativo")
    private BigDecimal minAmount;
    
    @DecimalMin(value = "0", message = "El descuento máximo no puede ser negativo")
    private BigDecimal maxDiscount;
    
    @Min(value = 1, message = "El límite de uso debe ser al menos 1")
    private Integer usageLimit;
    
    @Min(value = 1, message = "El límite por usuario debe ser al menos 1")
    private Integer usageLimitPerUser = 1;
    
    private List<Long> applicablePlans; // null = aplicable a todos los planes
    
    private LocalDateTime startDate;
    
    @Future(message = "La fecha de expiración debe ser en el futuro")
    private LocalDateTime expirationDate;
}