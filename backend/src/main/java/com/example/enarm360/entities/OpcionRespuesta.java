package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opcion_respuesta",
       uniqueConstraints = @UniqueConstraint(columnNames = {"pregunta_id", "orden"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpcionRespuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private Pregunta pregunta;
    
    @Column(nullable = false)
    private Short orden;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;
    
    @Builder.Default
    @Column(name = "es_correcta", nullable = false)
    private Boolean esCorrecta = false;
    
    @Column(columnDefinition = "TEXT")
    private String explicacion;
    
    // Relación One-to-Many
    @OneToMany(mappedBy = "opcion", fetch = FetchType.LAZY)
    @Builder.Default
    private List<IntentoOpcion> intentoOpciones = new ArrayList<>();
}