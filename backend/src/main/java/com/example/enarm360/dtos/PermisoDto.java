package com.example.enarm360.dtos;

import com.example.enarm360.entities.Permiso;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermisoDto {
    private Long id;
    private String codigo;
    private String descripcion;

    public static PermisoDto fromEntity(Permiso p) {
        return PermisoDto.builder()
                .id(p.getId())
                .codigo(p.getCodigo())
                .descripcion(p.getDescripcion())
                .build();
    }
}
