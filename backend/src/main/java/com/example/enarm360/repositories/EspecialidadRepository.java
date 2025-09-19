package com.example.enarm360.repositories;
import com.example.enarm360.entities.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Long> {

    // Buscar especialidad por nombre
    Optional<Especialidad> findByNombre(String nombre);

    // Buscar todas ordenadas por nombre
    List<Especialidad> findAllByOrderByNombreAsc();
}
