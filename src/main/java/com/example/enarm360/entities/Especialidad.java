package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "especialidad")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Especialidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String nombre;
    
    // Relaciones One-to-Many
    @OneToMany(mappedBy = "especialidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Tema> temas = new ArrayList<>();
    
    @OneToMany(mappedBy = "especialidad", fetch = FetchType.LAZY)
    @Builder.Default
    private List<CasoClinico> casos = new ArrayList<>();
    
    @OneToMany(mappedBy = "especialidad", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Examen> examenes = new ArrayList<>();
}