package com.example.enarm360.dtos;

import lombok.Data;
import java.util.List;

@Data
public class GenerarExamenRequest {
    private List<Long> especialidades;
    private int numReactivos;
    private Long usuarioId;
    // private int tiempoMin; // opcional, si quieres usar límite de tiempo
}
