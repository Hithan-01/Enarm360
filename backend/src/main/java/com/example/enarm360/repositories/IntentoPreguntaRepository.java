package com.example.enarm360.repositories;

import com.example.enarm360.entities.IntentoPregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IntentoPreguntaRepository extends JpaRepository<IntentoPregunta, Long> {

    // 🔹 Todas las respuestas de un intento
    List<IntentoPregunta> findByIntentoExamenId(Long intentoExamenId);

    // 🔹 Una respuesta específica de un intento a una pregunta
    Optional<IntentoPregunta> findByIntentoExamenIdAndPreguntaId(Long intentoExamenId, Long preguntaId);

    // 🔹 Contar cuántas preguntas lleva ya respondidas en ese intento
    int countByIntentoExamenId(Long intentoExamenId);

    //  Optional<IntentoPregunta> findByIntentoIdAndReactivoId(Long intentoId, Long reactivoId);

      Optional<IntentoPregunta> findByIntentoExamenIdAndReactivoId(Long intentoId, Long reactivoId);
    
}


