package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tema", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"especialidad_id", "nombre"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tema {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;
    
    @Column(nullable = false, length = 120)
    private String nombre;
    
    // Relaciones
    @ManyToMany(mappedBy = "temas", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Pregunta> preguntas = new HashSet<>();
    
    @OneToMany(mappedBy = "tema", fetch = FetchType.LAZY)
    @Builder.Default
    private List<CasoClinico> casos = new ArrayList<>();
}