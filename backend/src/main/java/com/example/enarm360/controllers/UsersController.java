package com.example.enarm360.controllers;

import com.example.enarm360.dtos.UsuarioMinDto;
import com.example.enarm360.entities.Usuario;
import com.example.enarm360.repositories.UsuarioRepository;
import com.example.enarm360.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsersController {

    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioMinDto>> search(
            @RequestParam("query") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        var result = usuarioRepository.searchUsers(query, pageable)
                .getContent()
                .stream()
                .map(UsuarioMinDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
