package com.example.enarm360.repositories;
import com.example.enarm360.entities.IntentoExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface IntentoExamenRepository extends JpaRepository<IntentoExamen, Long> {

    // Intentos por usuario
    List<IntentoExamen> findByUsuarioId(Long usuarioId);

    // Intentos de un examen específico
    List<IntentoExamen> findByExamenId(Long examenId);

    // Último intento de un usuario
    Optional<IntentoExamen> findTopByUsuarioIdOrderByIniciadoEnDesc(Long usuarioId);
}
