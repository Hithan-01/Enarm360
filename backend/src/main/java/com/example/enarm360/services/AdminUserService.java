package com.example.enarm360.services;

import com.example.enarm360.dtos.PermisoDto;
import com.example.enarm360.dtos.UsuarioPermisosDto;
import com.example.enarm360.entities.Permiso;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.repositories.PermisoRepository;
import com.example.enarm360.repositories.UsuarioRepository;
import com.example.enarm360.repositories.UsuarioPermisoLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminUserService {

    private final UsuarioRepository usuarioRepository;
    private final PermisoRepository permisoRepository;
    private final UsuarioPermisoLogRepository logRepository;
    private final AuthService authService;

    public List<PermisoDto> listPermisos() {
        return permisoRepository.findAll().stream().map(PermisoDto::fromEntity).collect(Collectors.toList());
    }

    public List<PermisoDto> seedDefaultPermisos() {
        String[] defaults = new String[]{
                "submit_questions", // crear preguntas
                "access_clinical_cases",
                "view_statistics",
                "forum_moderate",
                "exams_export",
                "payments_manage",
                "users_manage",
                "permisos_manage"
        };
        for (String code : defaults) {
            if (!permisoRepository.existsByCodigo(code)) {
                var p = com.example.enarm360.entities.Permiso.builder()
                        .codigo(code)
                        .descripcion(code.replace('_', ' '))
                        .build();
                permisoRepository.save(p);
            }
        }
        return listPermisos();
    }

    public UsuarioPermisosDto getUsuarioPermisos(Long userId) {
        Usuario u = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UsuarioPermisosDto.fromEntity(u);
    }

    public UsuarioPermisosDto setActivo(Long userId, boolean activo) {
        Usuario u = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setActivo(activo);
        usuarioRepository.save(u);
        return UsuarioPermisosDto.fromEntity(u);
    }

    public UsuarioPermisosDto grantPermiso(Long userId, String codigo) {
        Usuario u = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Permiso p = permisoRepository.findByCodigo(codigo).orElseThrow(() -> new RuntimeException("Permiso no encontrado: " + codigo));
        u.getPermisos().add(p);
        usuarioRepository.save(u);
        // Log
        var actor = authService.getCurrentUser();
        logRepository.save(com.example.enarm360.entities.UsuarioPermisoLog.builder()
                .usuario(u)
                .permiso(p)
                .actor(usuarioRepository.findById(actor.getId()).orElseThrow())
                .accion(com.example.enarm360.entities.UsuarioPermisoLog.Accion.GRANT)
                .build());
        return UsuarioPermisosDto.fromEntity(u);
    }

    public UsuarioPermisosDto revokePermiso(Long userId, String codigo) {
        Usuario u = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Permiso p = permisoRepository.findByCodigo(codigo).orElseThrow(() -> new RuntimeException("Permiso no encontrado: " + codigo));
        u.getPermisos().remove(p);
        usuarioRepository.save(u);
        // Log
        var actor = authService.getCurrentUser();
        logRepository.save(com.example.enarm360.entities.UsuarioPermisoLog.builder()
                .usuario(u)
                .permiso(p)
                .actor(usuarioRepository.findById(actor.getId()).orElseThrow())
                .accion(com.example.enarm360.entities.UsuarioPermisoLog.Accion.REVOKE)
                .build());
        return UsuarioPermisosDto.fromEntity(u);
    }
    public List<com.example.enarm360.dtos.UsuarioPermisoLogDto> logsByUser(Long userId, Pageable pageable) {
        var page = logRepository.findByUsuarioIdOrderByCreadoEnDesc(userId, pageable);
        return page.getContent().stream().map(com.example.enarm360.dtos.UsuarioPermisoLogDto::fromEntity).collect(Collectors.toList());
    }
}
