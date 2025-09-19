package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.ExamenDTO;
import com.example.enarm360.dtos.ExamenPreguntaDTO;
import com.example.enarm360.entities.Examen;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


public class ExamenMapper {
    public static ExamenDTO toDTO(Examen examen) {
        if (examen == null) return null;

        List<ExamenPreguntaDTO> preguntas = examen.getExamenPreguntas() == null
                ? Collections.emptyList()
                : examen.getExamenPreguntas().stream()
                    .map(ExamenPreguntaMapper::toDTO) // 🔥 usa el mapper que ya definimos
                    .collect(Collectors.toList());

        return ExamenDTO.builder()
                .id(examen.getId())
                .nombre(examen.getNombre())
                .descripcion(examen.getDescripcion())
                .creadoEn(examen.getCreadoEn())
                .tiempoLimiteMin(examen.getTiempoLimiteMin())
                .preguntas(preguntas)
                .build();
    }
}
