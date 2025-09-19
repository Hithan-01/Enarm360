package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "caso_clinico")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CasoClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn;

    @Column(columnDefinition = "TEXT")
    private String enunciado;

    @Column(length = 200)
    private String titulo;

    @Column(name = "creado_por")
    private Long creadoPor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tema_id")
    private Tema tema;
}
