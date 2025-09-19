package com.example.enarm360.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenPreguntaDTO {

    private Long id;
    private Integer orden;
    private Double puntaje;

    private Long examenId;      
    private Long reactivoId;    
    private String reactivoTexto; 

    // Opciones de respuesta
    private String respuestaA;
    private String respuestaB;
    private String respuestaC;
    private String respuestaD;
}
