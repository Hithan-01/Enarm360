package com.example.enarm360.controllers;

import com.example.enarm360.dtos.EspecialidadDTO;
import com.example.enarm360.entities.Especialidad;
import com.example.enarm360.repositories.EspecialidadRepository;    
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/especialidades")
@RequiredArgsConstructor
public class EspecialidadController {

    private final EspecialidadRepository especialidadRepository;

   @GetMapping
    public ResponseEntity<List<EspecialidadDTO>> listar() {
        List<EspecialidadDTO> especialidades = especialidadRepository.findAll()
                .stream()
                .map(e -> new EspecialidadDTO(e.getId(), e.getNombre()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(especialidades);
    }
}
