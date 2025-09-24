package com.example.enarm360.dtos;

import com.example.enarm360.entities.Notificacion;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificacionDto {
    private Long id;
    private String titulo;
    private String mensaje;
    private String tipo; // string por simplicidad en el frontend
    private boolean leida;
    private Map<String, Object> metadata;
    private LocalDateTime creadoEn;

    public static NotificacionDto fromEntity(Notificacion n) {
        return NotificacionDto.builder()
                .id(n.getId())
                .titulo(n.getTitulo())
                .mensaje(n.getMensaje())
                .tipo(n.getTipo().name())
                .leida(n.isLeida())
                .metadata(n.getMetadata())
                .creadoEn(n.getCreadoEn())
                .build();
    }
}
