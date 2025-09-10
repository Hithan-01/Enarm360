package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "examen_pregunta",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"examen_caso_id", "pregunta_id"}),
           @UniqueConstraint(columnNames = {"examen_caso_id", "orden"})
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenPregunta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_caso_id", nullable = false)
    private ExamenCaso examenCaso;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private Pregunta pregunta;
    
    @Column(nullable = false)
    private Integer orden;
    
    @Builder.Default
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal puntaje = BigDecimal.ONE;
}