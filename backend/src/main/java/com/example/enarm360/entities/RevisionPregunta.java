package com.example.enarm360.entities;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;


@Entity
@Table(name = "revision_pregunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisionPregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "estado_resultante")
    private String estadoResultante;

    @Column(name = "registrado_en")
    private LocalDateTime registradoEn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revisor_id")
    private Usuario revisor;
}
