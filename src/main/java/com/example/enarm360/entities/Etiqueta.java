package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "etiqueta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Etiqueta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String nombre;
    
    // Relación Many-to-Many
    @ManyToMany(mappedBy = "etiquetas", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<CasoClinico> casos = new HashSet<>();
}