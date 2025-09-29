package com.example.enarm360.services;

import com.example.enarm360.dtos.NotificacionDto;
import com.example.enarm360.entities.Notificacion;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.repositories.NotificacionRepository;
import com.example.enarm360.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository repo;
    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public List<NotificacionDto> mias(int page, int size) {
        Long userId = authService.getCurrentUser().getId();
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<Notificacion> p = repo.findByDestinatarioIdOrderByCreadoEnDesc(userId, pageable);
        return p.getContent().stream().map(NotificacionDto::fromEntity).collect(Collectors.toList());
    }

    public long countNoLeidas() {
        Long userId = authService.getCurrentUser().getId();
        return repo.countByDestinatarioIdAndLeidaFalse(userId);
    }

    public void marcarLeida(Long id) {
        Notificacion n = repo.findById(id).orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        Long userId = authService.getCurrentUser().getId();
        if (!n.getDestinatario().getId().equals(userId)) {
            throw new RuntimeException("No autorizado");
        }
        if (!n.isLeida()) {
            n.setLeida(true);
            repo.save(n);
        }
    }


    public NotificacionDto crear(Long destinatarioId, String titulo, String mensaje, Notificacion.Tipo tipo, Map<String,Object> metadata) {
        Usuario dest = usuarioRepository.findById(destinatarioId).orElseThrow(() -> new RuntimeException("Usuario destino no encontrado"));
        Long creadorId = authService.getCurrentUser().getId();
        Usuario creador = usuarioRepository.findById(creadorId).orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        Notificacion n = Notificacion.builder()
                .destinatario(dest)
                .creador(creador)
                .titulo(titulo)
                .mensaje(mensaje)
                .tipo(tipo)
                .metadata(metadata)
                .leida(false)
                .build();
        n = repo.save(n);
        return NotificacionDto.fromEntity(n);
    }

    public int crearParaTodos(String titulo, String mensaje, Notificacion.Tipo tipo, Map<String,Object> metadata) {
        var usuarios = usuarioRepository.findAllActiveUsers();
        if (usuarios == null || usuarios.isEmpty()) return 0;

        Long creadorId = authService.getCurrentUser().getId();
        Usuario creador = usuarioRepository.findById(creadorId).orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        var lista = usuarios.stream().map(u -> Notificacion.builder()
                .destinatario(u)
                .creador(creador)
                .titulo(titulo)
                .mensaje(mensaje)
                .tipo(tipo)
                .metadata(metadata)
                .leida(false)
                .build()).collect(Collectors.toList());
        repo.saveAll(lista);
        return lista.size();
    }
}
