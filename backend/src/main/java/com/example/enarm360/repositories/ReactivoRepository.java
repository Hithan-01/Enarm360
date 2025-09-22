package com.example.enarm360.repositories;


import com.example.enarm360.entities.Reactivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactivoRepository extends JpaRepository<Reactivo, Long> {

    List<Reactivo> findByEspecialidad_Id(Long especialidadId);

    List<Reactivo> findByDificultad_Id(Long dificultadId);

    List<Reactivo> findByUsuario_Id(Long usuarioId);

    // Seleccionar reactivos aleatorios de una especialidad



    
    @Query(value = "SELECT * FROM reactivos WHERE especialidad_id = :especialidadId ORDER BY RANDOM() LIMIT :num", 
           nativeQuery = true)
    List<Reactivo> findRandomByEspecialidad(@Param("especialidadId") Long especialidadId,
                                            @Param("num") int num);



  @Query("SELECT r FROM Reactivo r WHERE r.examen.id = :examenId")
    List<Reactivo> findByExamenId(@Param("examenId") Long examenId);

}
