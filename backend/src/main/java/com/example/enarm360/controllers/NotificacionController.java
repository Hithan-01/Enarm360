package com.example.enarm360.controllers;

import com.example.enarm360.dtos.NotificacionDto;
import com.example.enarm360.entities.Notificacion;
import com.example.enarm360.services.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificacionController {

    private final NotificacionService svc;

    @GetMapping("/mias")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificacionDto>> mias(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(svc.mias(page, size));
    }

    @GetMapping("/mias/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> countNoLeidas() {
        return ResponseEntity.ok(Map.of("unread", svc.countNoLeidas()));
    }

    @PatchMapping("/{id}/leer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id) {
        svc.marcarLeida(id);
        return ResponseEntity.ok().build();
    }


    // Endpoint para crear notificaciones (ADMIN) - útil para pruebas iniciales
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificacionDto> crear(@RequestBody CrearNotificacionRequest req) {
        NotificacionDto dto = svc.crear(
                req.destinatarioId,
                req.titulo,
                req.mensaje,
                req.tipo,
                req.metadata
        );
        return ResponseEntity.ok(dto);
    }

    public static class CrearNotificacionRequest {
        public Long destinatarioId;
        public String titulo;
        public String mensaje;
        public Notificacion.Tipo tipo;
        public Map<String, Object> metadata;
    }

    public static class CrearBroadcastRequest {
        public String titulo;
        public String mensaje;
        public Notificacion.Tipo tipo;
        public Map<String, Object> metadata;
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> broadcast(@RequestBody CrearBroadcastRequest req) {
        int count = svc.crearParaTodos(req.titulo, req.mensaje, req.tipo, req.metadata);
        return ResponseEntity.ok(Map.of("created", count));
    }
}
