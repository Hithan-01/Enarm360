package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.IntentoPreguntaDTO;
import com.example.enarm360.entities.IntentoPregunta;
import java.util.HashMap;
import java.util.Map;


public class IntentoPreguntaMapper {

    public static IntentoPreguntaDTO toDTO(IntentoPregunta ip) {
        if (ip == null) return null;

        Map<String, String> opciones = new HashMap<>();
        if (ip.getReactivo() != null) {
            opciones.put("a", ip.getReactivo().getRespuestaA());
            opciones.put("b", ip.getReactivo().getRespuestaB());
            opciones.put("c", ip.getReactivo().getRespuestaC());
            opciones.put("d", ip.getReactivo().getRespuestaD());
        }

        return IntentoPreguntaDTO.builder()
                .id(ip.getId())
                .orden(ip.getOrden())
                .correcta(ip.isCorrecta())
                .respondida(ip.isRespondida())
                .tiempoSeg(ip.getTiempoSeg())
                .enunciadoSnap(ip.getEnunciadoSnap())
                .explicacionSnap(ip.getExplicacionSnap())
                .intentoExamenId(ip.getIntentoExamen() != null ? ip.getIntentoExamen().getId() : null)
                .reactivoId(ip.getReactivo() != null ? ip.getReactivo().getId() : null)
                .respuestaSeleccionada(ip.getRespuesta())  // letra elegida
                .respuestaCorrecta(ip.getReactivo() != null ? ip.getReactivo().getRespuestaCorrecta() : null)
                .opciones(opciones)
                .build();
        }
    }

