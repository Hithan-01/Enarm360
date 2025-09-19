package com.example.enarm360.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
@Entity
@Table(name = "intento_pregunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntentoPregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean correcta;
    private boolean respondida;

    private Integer orden;

    @Column(name = "tiempo_seg")
    private Integer tiempoSeg;

    @Column(name = "enunciado_snap", columnDefinition = "TEXT", nullable = false)
    private String enunciadoSnap;

    @Column(name = "explicacion_snap", columnDefinition = "TEXT")
    private String explicacionSnap;

    // 🔹 Cambiado de intento_caso_id → intento_examen_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intento_examen_id", nullable = false)
    private IntentoExamen intentoExamen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reactivo_id")
    private Reactivo reactivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opcion_id")
    private OpcionRespuesta opcionSeleccionada;


    @Column(name = "respuesta", length = 1)
private String respuesta; // "a", "b", "c" o "d"



}