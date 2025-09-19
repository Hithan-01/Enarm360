package com.example.enarm360.repositories;
import com.example.enarm360.entities.OpcionRespuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface OpcionRespuestaRepository  extends JpaRepository<OpcionRespuesta, Long> {

    // Opciones por pregunta
    List<OpcionRespuesta> findByPreguntaId(Long preguntaId);

    // Opción correcta para una pregunta
    Optional<OpcionRespuesta> findByPreguntaIdAndEsCorrectaTrue(Long preguntaId);

    
} 
