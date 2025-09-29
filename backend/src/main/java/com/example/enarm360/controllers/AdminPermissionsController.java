package com.example.enarm360.controllers;

import com.example.enarm360.dtos.PermisoDto;
import com.example.enarm360.dtos.UsuarioPermisosDto;
import com.example.enarm360.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminPermissionsController {

    private final AdminUserService svc;

    // Listar permisos disponibles
    @GetMapping("/permisos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PermisoDto>> listPermisos() {
        return ResponseEntity.ok(svc.listPermisos());
    }

    // Seed de permisos por defecto
    @PostMapping("/permisos/seed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PermisoDto>> seedPermisos() {
        return ResponseEntity.ok(svc.seedDefaultPermisos());
    }

    // Info de permisos de un usuario
    @GetMapping("/usuarios/{id}/permisos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioPermisosDto> getUsuarioPermisos(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getUsuarioPermisos(id));
    }

    // Activar/Desactivar usuario
    @PatchMapping("/usuarios/{id}/activo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioPermisosDto> setActivo(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean activo = body.getOrDefault("activo", true);
        return ResponseEntity.ok(svc.setActivo(id, activo));
    }

    // Otorgar permiso directo
    @PostMapping("/usuarios/{id}/permisos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioPermisosDto> grant(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String codigo = body.get("codigo");
        return ResponseEntity.ok(svc.grantPermiso(id, codigo));
    }

    // Revocar permiso directo
    @DeleteMapping("/usuarios/{id}/permisos/{codigo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioPermisosDto> revoke(@PathVariable Long id, @PathVariable String codigo) {
        return ResponseEntity.ok(svc.revokePermiso(id, codigo));
    }

    // Logs de permisos por usuario
    @GetMapping("/usuarios/{id}/permisos/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<com.example.enarm360.dtos.UsuarioPermisoLogDto>> logs(@PathVariable Long id,
                                                                                     @RequestParam(defaultValue = "20") int limit) {
        var pageable = PageRequest.of(0, Math.max(1, limit));
        var page = svc.logsByUser(id, pageable);
        return ResponseEntity.ok(page);
    }
}
