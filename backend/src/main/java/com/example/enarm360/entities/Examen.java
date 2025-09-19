package com.example.enarm360.entities;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "examen")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn;

    private String descripcion;

    private String nombre;

    @Column(name = "tiempo_limite_min")
    private Integer tiempoLimiteMin;

    @Column(name = "creado_por")
    private Long creadoPor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

  @OneToMany(mappedBy = "examen", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
@Builder.Default
private List<ExamenPregunta> examenPreguntas = new ArrayList<>();

}


