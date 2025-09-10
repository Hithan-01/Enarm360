package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "intento_examen")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntentoExamen {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id")
    private Examen examen;
    
    @CreationTimestamp
    @Column(name = "iniciado_en", nullable = false)
    private LocalDateTime iniciadoEn;
    
    @Column(name = "finalizado_en")
    private LocalDateTime finalizadoEn;
    
    @Column(name = "duracion_seg")
    private Integer duracionSeg;
    
    @Column(name = "puntaje_total", precision = 8, scale = 2)
    private BigDecimal puntajeTotal;
    
    private Integer correctas;
    
    private Integer incorrectas;
    
    @Column(name = "en_blanco")
    private Integer enBlanco;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "intento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<IntentoCaso> casos = new ArrayList<>();
}