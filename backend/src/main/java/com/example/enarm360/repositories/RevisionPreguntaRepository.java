package com.example.enarm360.repositories;

import com.example.enarm360.entities.RevisionPregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface RevisionPreguntaRepository extends JpaRepository<RevisionPregunta, Long> {

    // Revisiones por pregunta
    List<RevisionPregunta> findByPreguntaId(Long preguntaId);

    // Revisiones hechas por un revisor
    List<RevisionPregunta> findByRevisorId(Long revisorId);
}
