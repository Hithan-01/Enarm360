package com.example.enarm360.repositories;
import com.example.enarm360.entities.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {

    // Preguntas por especialidad
    List<Pregunta> findByEspecialidad_Id(Long especialidadId);


    // Preguntas por caso clínico
    List<Pregunta> findByCasoId(Long casoId);

    // Solo preguntas activas
    List<Pregunta> findByActivaTrue();

    // Buscar preguntas aleatorias por especialidad (soporte para simulador)
    @Query(value = "SELECT * FROM pregunta p WHERE p.especialidad_id = :especialidadId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Pregunta> findRandomByEspecialidad(@Param("especialidadId") Long especialidadId, @Param("limit") int limit);
}
