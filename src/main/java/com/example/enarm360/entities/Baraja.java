package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "baraja")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Baraja {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 150)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "baraja", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<BarajaFlashcard> flashcards = new ArrayList<>();
}