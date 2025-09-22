package com.example.enarm360.dtos;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private LocalDateTime creadoEn;
    private Integer tiempoLimiteMin;

    // lista de preguntas con metadata extra (orden, puntaje, etc.)
    private List<ExamenPreguntaDTO> preguntas;
}
