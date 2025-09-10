package com.example.enarm360.entities;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardUsuarioId implements Serializable {
    private Long usuario;
    private Long flashcard;
}
