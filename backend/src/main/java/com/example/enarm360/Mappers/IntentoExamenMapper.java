package com.example.enarm360.Mappers;

import com.example.enarm360.dtos.IntentoExamenDTO;
import com.example.enarm360.entities.IntentoExamen;

public class IntentoExamenMapper {

  public static IntentoExamenDTO toDTO(IntentoExamen intento) {
    if (intento == null) return null;

    return IntentoExamenDTO.builder()
            .id(intento.getId())
            .examenId(intento.getExamen() != null ? intento.getExamen().getId() : null)
            .examenNombre(intento.getExamen() != null ? intento.getExamen().getNombre() : null)
            .correctas(intento.getCorrectas() != null ? intento.getCorrectas() : 0)
            .incorrectas(intento.getIncorrectas() != null ? intento.getIncorrectas() : 0)
            .enBlanco(intento.getEnBlanco() != null ? intento.getEnBlanco() : 0)
            .puntajeTotal(intento.getPuntajeTotal() != null ? intento.getPuntajeTotal() : 0.0)
            .duracionSeg(intento.getDuracionSeg() != null ? intento.getDuracionSeg() : 0)
            .iniciadoEn(intento.getIniciadoEn())
            .finalizadoEn(intento.getFinalizadoEn())
            .build();
}
    
    }   