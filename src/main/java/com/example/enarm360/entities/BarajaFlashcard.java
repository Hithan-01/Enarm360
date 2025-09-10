package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "baraja_flashcard")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(BarajaFlashcardId.class)
public class BarajaFlashcard {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "baraja_id")
    private Baraja baraja;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
    
    private Integer orden;
}