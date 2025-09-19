package com.example.enarm360.entities;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
@Entity
@Table(name = "opcion_respuesta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpcionRespuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String explicacion;

    @Column(columnDefinition = "TEXT")
    private String justificacion;

    private Short orden;

    private Double peso;

    @Column(name = "porcentaje_correcto")
    private Double porcentajeCorrecto;

    @Column(columnDefinition = "TEXT")
    private String texto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;

    @Column(name = "es_correcta")
    private Boolean esCorrecta;

 

}
