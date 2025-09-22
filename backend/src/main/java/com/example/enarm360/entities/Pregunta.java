package com.example.enarm360.entities;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;


@Entity
@Table(name = "pregunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean activa;

    @Column(name = "actualizada_en")
    private LocalDateTime actualizadaEn;

    @Column(name = "creada_en")
    private LocalDateTime creadaEn;

    @Column(columnDefinition = "TEXT")
    private String enunciado;

    private String estado;

    @Column(columnDefinition = "TEXT")
    private String explicacion;

    @Column(columnDefinition = "TEXT")
    private String fuente;

    // --- Relaciones ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caso_id")
    private CasoClinico caso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creada_por")
    private Usuario creadaPor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobada_por")
    private Usuario aprobadaPor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revisada_por")
    private Usuario revisadaPor;


    @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "especialidad_id")
private Especialidad especialidad;
}
