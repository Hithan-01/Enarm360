package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "examen_caso",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"examen_id", "caso_id"}),
           @UniqueConstraint(columnNames = {"examen_id", "orden"})
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenCaso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id", nullable = false)
    private Examen examen;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caso_id", nullable = false)
    private CasoClinico caso;
    
    @Column(nullable = false)
    private Integer orden;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "examenCaso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<ExamenPregunta> preguntas = new ArrayList<>();
}