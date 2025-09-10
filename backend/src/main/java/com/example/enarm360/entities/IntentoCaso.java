package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "intento_caso")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntentoCaso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intento_id", nullable = false)
    private IntentoExamen intento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caso_id")
    private CasoClinico caso;
    
    private Integer orden;
    
    @Column(name = "enunciado_snap", columnDefinition = "TEXT")
    private String enunciadoSnap;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "intentoCaso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<IntentoPregunta> preguntas = new ArrayList<>();
}