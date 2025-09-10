package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "flashcard_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(FlashcardUsuarioId.class)
public class FlashcardUsuario {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
    
    @Column(name = "ultima_revision")
    private LocalDateTime ultimaRevision;
    
    @Builder.Default
    private Integer aciertos = 0;
    
    @Builder.Default
    private Integer errores = 0;
    
    @Builder.Default
    private Boolean marcada = false;
}