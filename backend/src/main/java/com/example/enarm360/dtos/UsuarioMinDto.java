package com.example.enarm360.dtos;

import com.example.enarm360.entities.Usuario;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioMinDto {
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellidos;

    public static UsuarioMinDto fromEntity(Usuario u) {
        return UsuarioMinDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .apellidos(u.getApellidos())
                .build();
    }
}
