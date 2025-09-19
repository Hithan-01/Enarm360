package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.ExamenPreguntaDTO;
import com.example.enarm360.entities.ExamenPregunta;

public class ExamenPreguntaMapper {

    public static ExamenPreguntaDTO toDTO(ExamenPregunta ep) {
        if (ep == null) return null;

        return ExamenPreguntaDTO.builder()
                .id(ep.getId())
                .orden(ep.getOrden())
                .puntaje(ep.getPuntaje())
                .examenId(ep.getExamen() != null ? ep.getExamen().getId() : null)
                .reactivoId(ep.getReactivo() != null ? ep.getReactivo().getId() : null)
                .reactivoTexto(ep.getReactivo() != null ? ep.getReactivo().getPregunta() : null)
                .respuestaA(ep.getReactivo() != null ? ep.getReactivo().getRespuestaA() : null)
                .respuestaB(ep.getReactivo() != null ? ep.getReactivo().getRespuestaB() : null)
                .respuestaC(ep.getReactivo() != null ? ep.getReactivo().getRespuestaC() : null)
                .respuestaD(ep.getReactivo() != null ? ep.getReactivo().getRespuestaD() : null)
                .build();
    }
}

