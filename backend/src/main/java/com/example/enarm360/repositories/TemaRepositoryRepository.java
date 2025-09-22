package com.example.enarm360.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.enarm360.entities.Tema;


public interface TemaRepositoryRepository extends JpaRepository<Tema, Long> {

 List<Tema> findByEspecialidadId(Long especialidadId);
    }