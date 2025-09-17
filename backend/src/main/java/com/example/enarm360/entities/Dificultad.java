package com.example.enarm360.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Entity
@Table(name = "dificultades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dificultad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "El nombre de la dificultad es obligatorio")
    private String nombre;
    
    // Relación con reactivos
    @OneToMany(mappedBy = "dificultad", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("dificultad")
    private List<Reactivo> reactivos;
    
    // Relación con preguntas de casos
    @OneToMany(mappedBy = "dificultad", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("dificultad")
    private List<PreguntaCaso> preguntasCasos;
}