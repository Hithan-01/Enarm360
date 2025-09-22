package com.example.enarm360.dtos;
import java.util.Map;


import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntentoPreguntaDTO {

    private Long id;

    private Integer orden;
    private boolean correcta;
    private boolean respondida;
    private Integer tiempoSeg;

    // Snapshots
    private String enunciadoSnap;
    private String explicacionSnap;

    // Relaciones
    private Long intentoExamenId;
    private Long reactivoId;

    // Respuestas
    private String respuestaSeleccionada;  // letra elegida
    private String respuestaCorrecta;      // letra correcta
    private Map<String, String> opciones;  // {a: "texto...", b: "...", c: "...", d: "..."}
}
