package com.example.enarm360.dtos;
import lombok.Builder;
import lombok.Data; 
import java.time.LocalDateTime;


@Data
@Builder
public class IntentoExamenDTO {
    private Long id;
    private Long examenId;
    private String examenNombre;
    private int correctas;
    private int incorrectas;
    private int enBlanco;
    private Double puntajeTotal;
    private Integer duracionSeg;
    private LocalDateTime iniciadoEn;
    private LocalDateTime finalizadoEn;
}
