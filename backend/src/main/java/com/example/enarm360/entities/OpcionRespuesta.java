package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opcion_respuesta",
       uniqueConstraints = @UniqueConstraint(columnNames = {"pregunta_id", "orden"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpcionRespuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private Pregunta pregunta;
    
    @Column(nullable = false)
    private Short orden;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;
    
    // CAMBIO: reemplazar es_correcta con porcentaje_correcto
    @Builder.Default
    @Column(name = "porcentaje_correcto", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeCorrect = BigDecimal.ZERO;
    
    @Column(columnDefinition = "TEXT")
    private String explicacion;
    
    // NUEVO: campo para justificar el porcentaje
    @Column(name = "justificacion", columnDefinition = "TEXT")
    private String justificacion;
    
    // CAMPO EXISTENTE: peso (ya lo tienes en la BD)
    @Builder.Default
    @Column(name = "peso", nullable = false, precision = 10, scale = 2)
    private BigDecimal peso = BigDecimal.ZERO;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "opcion", fetch = FetchType.LAZY)
    @Builder.Default
    private List<IntentoOpcion> intentoOpciones = new ArrayList<>();
    
    // ==========================================================
    // MÉTODOS AUXILIARES (sin usar Lombok para estos)
    // ==========================================================
    
    /**
     * Verifica si esta opción tiene el mayor porcentaje
     */
    public boolean esMejorOpcion() {
        if (pregunta == null || pregunta.getOpciones() == null) {
            return false;
        }
        
        return pregunta.getOpciones().stream()
            .map(OpcionRespuesta::getPorcentajeCorrect)
            .max(BigDecimal::compareTo)
            .map(max -> porcentajeCorrect.compareTo(max) == 0)
            .orElse(false);
    }
    
    /**
     * Convierte porcentaje a double para cálculos
     */
    public double getPorcentajeAsDouble() {
        return porcentajeCorrect != null ? porcentajeCorrect.doubleValue() : 0.0;
    }
    
    /**
     * Establece porcentaje desde double
     */
    public void setPorcentajeFromDouble(double porcentaje) {
        this.porcentajeCorrect = BigDecimal.valueOf(porcentaje);
    }
    
    /**
     * Valida que el porcentaje esté en rango válido (0-100)
     */
    public boolean isPorcentajeValido() {
        return porcentajeCorrect != null && 
               porcentajeCorrect.compareTo(BigDecimal.ZERO) >= 0 && 
               porcentajeCorrect.compareTo(new BigDecimal("100.00")) <= 0;
    }
}