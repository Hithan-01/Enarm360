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
    private CreadorInfo creador;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreadorInfo {
        private Long id;
        private String username;
        private String nombre;
        private String apellidos;
        private String email;
    }

    public static NotificacionDto fromEntity(Notificacion n) {
        CreadorInfo creadorInfo = null;
        if (n.getCreador() != null) {
            creadorInfo = CreadorInfo.builder()
                    .id(n.getCreador().getId())
                    .username(n.getCreador().getUsername())
                    .nombre(n.getCreador().getNombre())
                    .apellidos(n.getCreador().getApellidos())
                    .email(n.getCreador().getEmail())
                    .build();
        }

        return NotificacionDto.builder()
                .id(n.getId())
                .titulo(n.getTitulo())
                .mensaje(n.getMensaje())
                .tipo(n.getTipo().name())
                .leida(n.isLeida())
                .metadata(n.getMetadata())
                .creadoEn(n.getCreadoEn())
                .creador(creadorInfo)
                .build();
    }
}
