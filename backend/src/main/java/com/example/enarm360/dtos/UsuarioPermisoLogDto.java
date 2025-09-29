package com.example.enarm360.dtos;

import com.example.enarm360.entities.UsuarioPermisoLog;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioPermisoLogDto {
    private String permisoCodigo;
    private String accion;
    private Long actorId;
    private String actorUsername;
    private LocalDateTime creadoEn;

    public static UsuarioPermisoLogDto fromEntity(UsuarioPermisoLog l) {
        return UsuarioPermisoLogDto.builder()
                .permisoCodigo(l.getPermiso().getCodigo())
                .accion(l.getAccion().name())
                .actorId(l.getActor().getId())
                .actorUsername(l.getActor().getUsername())
                .creadoEn(l.getCreadoEn())
                .build();
    }
}
