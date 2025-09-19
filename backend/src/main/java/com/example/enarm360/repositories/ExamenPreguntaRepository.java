package com.example.enarm360.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.enarm360.entities.Examen;
import com.example.enarm360.entities.ExamenPregunta;
import com.example.enarm360.entities.Pregunta;

import java.util.List;

@Repository
public interface   ExamenPreguntaRepository  extends JpaRepository<ExamenPregunta, Long> {
List<ExamenPregunta> findByExamen_Id(Long examenId);




}

