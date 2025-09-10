package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "caso_clinico")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CasoClinico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String titulo;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tema_id")
    private Tema tema;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por")
    private Usuario creadoPor;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;
    
    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;
    
    // Relación Many-to-Many con Etiquetas usando @JoinTable
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "caso_etiqueta",
        joinColumns = @JoinColumn(name = "caso_id"),
        inverseJoinColumns = @JoinColumn(name = "etiqueta_id")
    )
    @Builder.Default
    private Set<Etiqueta> etiquetas = new HashSet<>();
    
    // Relaciones One-to-Many
    @OneToMany(mappedBy = "caso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Pregunta> preguntas = new ArrayList<>();
    
    @OneToMany(mappedBy = "caso", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ExamenCaso> examenCasos = new ArrayList<>();
    
    @OneToMany(mappedBy = "caso", fetch = FetchType.LAZY)
    @Builder.Default
    private List<IntentoCaso> intentoCasos = new ArrayList<>();
}