package com.example.enarm360.services;

import com.example.enarm360.Mappers.ExamenMapper;
import com.example.enarm360.Mappers.IntentoExamenMapper;
import com.example.enarm360.dtos.ExamenDTO;
import com.example.enarm360.dtos.IntentoExamenDTO;
import com.example.enarm360.dtos.IntentoPreguntaDTO;
import com.example.enarm360.entities.*;
import com.example.enarm360.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExamenService {

    private final ExamenRepository examenDao;
    private final ReactivoRepository reactivoDao;
    private final ExamenPreguntaRepository examenPreguntaDao;
    private final IntentoExamenRepository intentoExamenDao;
    private final IntentoPreguntaRepository intentoPreguntaDao;
    private final OpcionRespuestaRepository opcionRespuestaDao;
    private final PreguntaRepository preguntaDao;

    // ==========================================================
    // GENERACIÓN DE EXÁMENES
    // ==========================================================

   @Transactional
public Examen generarExamen(List<Long> especialidadIds, int numReactivos, Long usuarioId) {
    Examen examen = Examen.builder()
            .nombre("Examen generado")
            .descripcion("Examen con " + numReactivos + " reactivos")
            .creadoPor(usuarioId)
            .creadoEn(LocalDateTime.now())
            .build();

    examen = examenDao.save(examen);

    int orden = 1;
    for (Long espId : especialidadIds) {
        List<Reactivo> reactivos = reactivoDao.findRandomByEspecialidad(espId, numReactivos);
        for (Reactivo r : reactivos) {
            ExamenPregunta ep = ExamenPregunta.builder()
                    .examen(examen)
                    .reactivo(r)
                    .orden(orden++)
                    .puntaje(1.0)
                    .build();
            examenPreguntaDao.save(ep);
        }
    }

    return examen;
}

    // ==========================================================
    // INTENTOS
    // ==========================================================

       @Transactional
public IntentoExamen iniciarIntento(Long examenId, Long usuarioId) {
    IntentoExamen intento = IntentoExamen.builder()
            .examen(examenDao.findById(examenId).orElseThrow())
            .usuario(Usuario.builder().id(usuarioId).build())
            .iniciadoEn(LocalDateTime.now())
            .correctas(0)   // 🔥 inicializar en 0
            .incorrectas(0) // 🔥
            .enBlanco(0)    // 🔥
            .puntajeTotal(0.0)
            .duracionSeg(0)
            .build();

    return intentoExamenDao.save(intento);
}

 
    @Transactional
    public IntentoPregunta responderPregunta(Long intentoId, Long preguntaId, Long opcionId) {
        IntentoExamen intento = intentoExamenDao.findById(intentoId)
                .orElseThrow(() -> new RuntimeException("Intento no encontrado con id " + intentoId));

        Pregunta pregunta = preguntaDao.findById(preguntaId)
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada con id " + preguntaId));

        OpcionRespuesta opcion = opcionRespuestaDao.findById(opcionId)
                .orElseThrow(() -> new RuntimeException("Opción no encontrada con id " + opcionId));

        boolean correcta = opcion.getEsCorrecta();

        IntentoPregunta intentoPregunta = IntentoPregunta.builder()
                .intentoExamen(intento)
                .pregunta(pregunta)
                .opcionSeleccionada(opcion)
                .correcta(correcta)
                .respondida(true)
                .orden(0)
                .tiempoSeg(0)
                .build();

        return intentoPreguntaDao.save(intentoPregunta);
    }

    @Transactional
public IntentoPregunta responderReactivo(Long intentoId, Long reactivoId, String respuesta) {
    IntentoExamen intento = intentoExamenDao.findById(intentoId)
            .orElseThrow(() -> new RuntimeException("Intento no encontrado con id " + intentoId));

    Reactivo reactivo = reactivoDao.findById(reactivoId)
            .orElseThrow(() -> new RuntimeException("Reactivo no encontrado con id " + reactivoId));

    boolean correcta = reactivo.getRespuestaCorrecta().equalsIgnoreCase(respuesta);

    // 🔹 calcular orden dinámicamente
    int orden = intentoPreguntaDao.countByIntentoExamenId(intentoId) + 1;

    IntentoPregunta intentoPregunta = IntentoPregunta.builder()
            .intentoExamen(intento)
            .reactivo(reactivo)
            .enunciadoSnap(reactivo.getPregunta())
            .explicacionSnap(reactivo.getRetroalimentacion())
            .correcta(correcta)
            .respondida(true)
            .orden(orden)
            .tiempoSeg(0)
            .build();

    return intentoPreguntaDao.save(intentoPregunta);
}
@Transactional
public IntentoExamenDTO finalizarIntento(Long intentoId) {
    IntentoExamen intento = intentoExamenDao.findById(intentoId)
            .orElseThrow(() -> new RuntimeException("Intento no encontrado"));

    long correctas = intento.getPreguntas().stream().filter(IntentoPregunta::isCorrecta).count();
    long incorrectas = intento.getPreguntas().stream()
                              .filter(ip -> ip.isRespondida() && !ip.isCorrecta())
                              .count();
    long enBlanco = intento.getPreguntas().stream()
                           .filter(ip -> !ip.isRespondida())
                           .count();

    intento.setCorrectas((int) correctas);
    intento.setIncorrectas((int) incorrectas);
    intento.setEnBlanco((int) enBlanco);
    intento.setFinalizadoEn(java.time.LocalDateTime.now());

    intentoExamenDao.save(intento);

    return IntentoExamenMapper.toDTO(intento);
}




    // ==========================================================
    // CONSULTAS
    // ==========================================================

    @Transactional(readOnly = true)
    public Examen getExamenConPreguntas(Long examenId) {
        return examenDao.findById(examenId)
                .orElseThrow(() -> new RuntimeException("Examen no encontrado con id " + examenId));
    }

  @Transactional(readOnly = true)
public Examen getExamenConReactivos(Long examenId) {
    Examen examen = examenDao.findById(examenId)
            .orElseThrow(() -> new RuntimeException("Examen no encontrado con id " + examenId));

    // Inicializar la relación examenPreguntas → reactivo
    examen.getExamenPreguntas().forEach(ep -> ep.getReactivo().getId());

    return examen;
}
@Transactional(readOnly = true)
public ExamenDTO getExamenDTO(Long examenId) {
    Examen examen = examenDao.findById(examenId)
            .orElseThrow(() -> new RuntimeException("Examen no encontrado"));
    return ExamenMapper.toDTO(examen); // ✅ delega al mapper
}

@Transactional(readOnly = true)
public List<IntentoPreguntaDTO> getRespuestasDeIntento(Long intentoId) {
    List<IntentoPregunta> respuestas = intentoPreguntaDao.findByIntentoExamenId(intentoId);
    return respuestas.stream()
            .map(ip -> com.example.enarm360.Mappers.IntentoPreguntaMapper.toDTO(ip))
            .toList();
}

@Transactional
public void guardarRespuestas(Long intentoId, Map<Long, String> respuestas) {
    IntentoExamen intento = intentoExamenDao.findById(intentoId)
            .orElseThrow(() -> new RuntimeException("Intento no encontrado"));

    respuestas.forEach((reactivoId, letraRespuesta) -> {
        IntentoPregunta ip = intentoPreguntaDao
                .findByIntentoExamenIdAndReactivoId(intentoId, reactivoId)
                .orElseGet(() -> {
                    Reactivo reactivo = reactivoDao.findById(reactivoId)
                            .orElseThrow(() -> new RuntimeException("Reactivo no encontrado"));

                    // 👇 aquí seteo snapshots para que no sean null
                    return IntentoPregunta.builder()
                            .intentoExamen(intento)
                            .reactivo(reactivo)
                            .orden(reactivo.getId().intValue()) // o el campo orden real
                            .enunciadoSnap(reactivo.getPregunta())
                            .explicacionSnap(reactivo.getRetroalimentacion())
                            .build();
                });

        ip.setRespuesta(letraRespuesta);
        ip.setRespondida(true);

        // marcar si es correcta
        boolean esCorrecta = ip.getReactivo()
                .getRespuestaCorrecta()
                .equalsIgnoreCase(letraRespuesta);
        ip.setCorrecta(esCorrecta);

        intentoPreguntaDao.save(ip);
    });
}



}
