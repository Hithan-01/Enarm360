package com.example.enarm360.services;

import com.example.enarm360.dtos.profile.ProfileDto;
import com.example.enarm360.dtos.profile.UpdateProfileDto;
import com.example.enarm360.entities.PerfilUsuario;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.repositories.PerfilUsuarioRepository;
import com.example.enarm360.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UsuarioRepository usuarioRepo;
    private final PerfilUsuarioRepository perfilRepo;

    private Usuario currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new RuntimeException("No autenticado");
        String login = auth.getName(); // username o email
        return usuarioRepo.findByUsernameOrEmailAndActivoTrue(login)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado/activo: " + login));
    }

    private static ProfileDto toDTO(Usuario u, PerfilUsuario p) {
        String nombre = (u.getNombre() == null ? "" : u.getNombre());
        String ap = (u.getApellidos() == null || u.getApellidos().isBlank()) ? "" : " " + u.getApellidos();
        return ProfileDto.builder()
                .usuarioId(u.getId())
                .email(u.getEmail())
                .username(u.getUsername())
                .nombreCompleto(nombre + ap)
                .avatarUrl(p != null ? p.getAvatarUrl() : null)
                .bio(p != null ? p.getBio() : null)
                .telefono(p != null ? p.getTelefono() : null)
                .pais(p != null ? p.getPais() : null)
                .tz(p != null ? p.getTz() : "America/Monterrey")
                .build();
    }

    @Transactional(readOnly = true)
    public ProfileDto me() {
        Usuario u = currentUser();
        PerfilUsuario p = perfilRepo.findById(u.getId()).orElse(null);
        return toDTO(u, p);
    }

    @Transactional
    public ProfileDto upsertMyProfile(UpdateProfileDto req) {
        Usuario u = currentUser();
        PerfilUsuario p = perfilRepo.findById(u.getId()).orElseGet(() -> {
            var x = new PerfilUsuario();
            x.setUsuario(u);
            x.setUsuarioId(u.getId());
            return x;
        });

        if (req.getBio() != null) p.setBio(req.getBio());
        if (req.getTelefono() != null) p.setTelefono(req.getTelefono());
        if (req.getPais() != null) p.setPais(req.getPais());
        if (req.getTz() != null) p.setTz(req.getTz());

        perfilRepo.save(p);
        return toDTO(u, p);
    }

    @Transactional
    public ProfileDto setAvatar(String avatarUrl) {
        Usuario u = currentUser();
        PerfilUsuario p = perfilRepo.findById(u.getId()).orElseGet(() -> {
            var x = new PerfilUsuario();
            x.setUsuario(u);
            x.setUsuarioId(u.getId());
            return x;
        });
        p.setAvatarUrl(avatarUrl);
        perfilRepo.save(p);
        return toDTO(u, p);
    }

    @Transactional(readOnly = true)
    public ProfileDto byUserId(Long id) {
        Usuario u = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        PerfilUsuario p = perfilRepo.findById(id).orElse(null);
        return toDTO(u, p);
    }
}
