package com.example.enarm360.repositories;

import com.example.enarm360.entities.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import com.example.enarm360.entities.CasoClinico;

@Repository
public interface CasoClinicoRepository extends JpaRepository<CasoClinico, Long> {

    // Buscar por especialidad
    List<CasoClinico> findByEspecialidadId(Long especialidadId);

    // Buscar por tema
    List<CasoClinico> findByTemaId(Long temaId);

    // Buscar por usuario creador
    List<CasoClinico> findByCreadoPor(Long usuarioId);
}
