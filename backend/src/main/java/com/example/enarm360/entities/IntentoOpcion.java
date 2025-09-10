package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "intento_opcion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntentoOpcion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intento_pregunta_id", nullable = false)
    private IntentoPregunta intentoPregunta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opcion_id")
    private OpcionRespuesta opcion;
    
    private Short orden;
    
    @Column(name = "texto_snap", nullable = false, columnDefinition = "TEXT")
    private String textoSnap;
    
    @Builder.Default
    @Column(name = "es_correcta_snap", nullable = false)
    private Boolean esCorrectaSnap = false;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean seleccionada = false;
}