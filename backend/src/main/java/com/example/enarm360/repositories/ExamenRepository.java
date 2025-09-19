package com.example.enarm360.repositories;
import com.example.enarm360.entities.Especialidad;
import com.example.enarm360.entities.Examen;
import com.example.enarm360.entities.Reactivo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {

    // Exámenes por especialidad
    List<Examen> findByEspecialidadId(Long especialidadId);

    // Exámenes creados por un usuario
    List<Examen> findByCreadoPor(Long usuarioId);

   
}


