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
@Table(name = "pregunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pregunta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caso_id", nullable = false)
    private CasoClinico caso;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;
    
    @Column(columnDefinition = "TEXT")
    private String explicacion;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPregunta estado = EstadoPregunta.BORRADOR;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creada_por")
    private Usuario creadaPor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revisada_por")
    private Usuario revisadaPor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobada_por")
    private Usuario aprobadaPor;
    
    @Column(columnDefinition = "TEXT")
    private String fuente;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean activa = true;
    
    @CreationTimestamp
    @Column(name = "creada_en", nullable = false)
    private LocalDateTime creadaEn;
    
    @UpdateTimestamp
    @Column(name = "actualizada_en", nullable = false)
    private LocalDateTime actualizadaEn;
    
    // Relación Many-to-Many con Temas usando @JoinTable
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "pregunta_tema",
        joinColumns = @JoinColumn(name = "pregunta_id"),
        inverseJoinColumns = @JoinColumn(name = "tema_id")
    )
    @Builder.Default
    private Set<Tema> temas = new HashSet<>();
    
    // Relaciones One-to-Many
    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<OpcionRespuesta> opciones = new ArrayList<>();
    
    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RevisionPregunta> revisiones = new ArrayList<>();
    
    @OneToMany(mappedBy = "pregunta", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ExamenPregunta> examenPreguntas = new ArrayList<>();
    
    @OneToMany(mappedBy = "pregunta", fetch = FetchType.LAZY)
    @Builder.Default
    private List<IntentoPregunta> intentoPreguntas = new ArrayList<>();
    
    @OneToMany(mappedBy = "pregunta", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Flashcard> flashcards = new ArrayList<>();
}