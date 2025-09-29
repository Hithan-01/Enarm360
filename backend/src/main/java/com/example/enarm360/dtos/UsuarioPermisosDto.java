package com.example.enarm360.dtos;

import com.example.enarm360.entities.Usuario;
import lombok.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioPermisosDto {
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellidos;
    private Boolean activo;
    private Set<String> roles; // nombres de rol
    private Set<String> directPermisos; // permisos asignados directamente (codigo)
    private Set<String> effectivePermisos; // union de permisos de roles + directos

    public static UsuarioPermisosDto fromEntity(Usuario u) {
        Set<String> roleNames = u.getRoles().stream().map(r -> r.getNombre()).collect(Collectors.toSet());
        Set<String> direct = u.getPermisos().stream().map(p -> p.getCodigo()).collect(Collectors.toSet());
        Set<String> fromRoles = u.getRoles().stream()
                .flatMap(r -> r.getPermisos().stream())
                .map(p -> p.getCodigo())
                .collect(Collectors.toSet());
        fromRoles.addAll(direct);
        return UsuarioPermisosDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .apellidos(u.getApellidos())
                .activo(u.getActivo())
                .roles(roleNames)
                .directPermisos(direct)
                .effectivePermisos(fromRoles)
                .build();
    }
}
