package com.example.enarm360.entities;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarajaFlashcardId implements Serializable {
    private Long baraja;
    private Long flashcard;
}