package com.example.enarm360.controllers;

import com.example.enarm360.dtos.ExamenDTO;
import com.example.enarm360.dtos.GenerarExamenRequest;
import com.example.enarm360.dtos.IntentoExamenDTO;
import com.example.enarm360.dtos.IntentoPreguntaDTO;
import com.example.enarm360.entities.Examen;
import com.example.enarm360.entities.IntentoPregunta;
import com.example.enarm360.services.ExamenService;
import com.example.enarm360.Mappers.IntentoExamenMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/examenes")
@RequiredArgsConstructor
public class ExamenController {

    private final ExamenService examenService;

    /**
     * Generar un examen SOLO con reactivos
     */
    @PostMapping("/generar")
    public ResponseEntity<ExamenDTO> generarExamen(@RequestBody GenerarExamenRequest request) {
        Examen examen = examenService.generarExamen(
                request.getEspecialidades(),
                request.getNumReactivos(),
                request.getUsuarioId()
        );
        return ResponseEntity.ok(
                // Usar tu ExamenMapper
                com.example.enarm360.Mappers.ExamenMapper.toDTO(examen)
        );
    }

    /**
     * Iniciar un intento de examen
     */
    @PostMapping("/{examenId}/iniciar")
    public ResponseEntity<IntentoExamenDTO> iniciarIntento(
            @PathVariable Long examenId,
            @RequestParam Long usuarioId
    ) {
        return ResponseEntity.ok(
                IntentoExamenMapper.toDTO(
                        examenService.iniciarIntento(examenId, usuarioId)
                )
        );
    }

    /**
     * Responder un reactivo (pregunta normal A–D)
     * 👉 Aquí todavía puedes devolver la entidad si no planeas mostrarla en frontend
     */
    @PostMapping("/intentos/{intentoId}/reactivo")
    public ResponseEntity<IntentoPregunta> responderReactivo(
            @PathVariable Long intentoId,
            @RequestParam Long reactivoId,
            @RequestParam String respuesta
    ) {
        return ResponseEntity.ok(
                examenService.responderReactivo(intentoId, reactivoId, respuesta)
        );
    }

    /**
     * Finalizar intento y calcular resultados
     */
    @PostMapping("/intentos/{intentoId}/finalizar")
    public ResponseEntity<IntentoExamenDTO> finalizarIntento(@PathVariable Long intentoId) {
        return ResponseEntity.ok(
                examenService.finalizarIntento(intentoId) // ahora retorna DTO en service
        );
    }

    /**
     * Obtener examen con reactivos
     */
    @GetMapping("/{examenId}")
    public ResponseEntity<ExamenDTO> getExamen(@PathVariable Long examenId) {
        return ResponseEntity.ok(examenService.getExamenDTO(examenId));
    }
    

    @GetMapping("/intentos/{intentoId}/respuestas")
    public ResponseEntity<List<IntentoPreguntaDTO>> getRespuestasDeIntento(
            @PathVariable Long intentoId
    ) {
        return ResponseEntity.ok(
                examenService.getRespuestasDeIntento(intentoId)
        );
}


@PostMapping("/intentos/{intentoId}/respuestas")
public ResponseEntity<Void> enviarRespuestas(
        @PathVariable Long intentoId,
        @RequestBody Map<Long, String> respuestas
) {
    examenService.guardarRespuestas(intentoId, respuestas);
    return ResponseEntity.ok().build();
}


}