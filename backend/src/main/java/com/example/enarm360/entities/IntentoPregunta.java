package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "intento_pregunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntentoPregunta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intento_caso_id", nullable = false)
    private IntentoCaso intentoCaso;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;
    
    @Column(name = "enunciado_snap", nullable = false, columnDefinition = "TEXT")
    private String enunciadoSnap;
    
    @Column(name = "explicacion_snap", columnDefinition = "TEXT")
    private String explicacionSnap;
    
    private Integer orden;
    
    @Column(name = "tiempo_seg")
    private Integer tiempoSeg;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean respondida = false;
    
    private Boolean correcta;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "intentoPregunta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<IntentoOpcion> opciones = new ArrayList<>();
}