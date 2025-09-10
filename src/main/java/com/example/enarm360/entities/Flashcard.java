package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "flashcard")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flashcard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String frente;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reverso;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creada_por")
    private Usuario creadaPor;
    
    @CreationTimestamp
    @Column(name = "creada_en", nullable = false)
    private LocalDateTime creadaEn;
    
    // Relaciones One-to-Many
    @OneToMany(mappedBy = "flashcard", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BarajaFlashcard> barajaFlashcards = new ArrayList<>();
    
    @OneToMany(mappedBy = "flashcard", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FlashcardUsuario> estadisticasUsuario = new ArrayList<>();
}