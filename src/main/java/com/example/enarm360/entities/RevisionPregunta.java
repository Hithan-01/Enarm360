package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private Pregunta pregunta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revisor_id")
    private Usuario revisor;
    
    @Column(nullable = false, length = 30)
    private String accion;
    
    @Column(columnDefinition = "TEXT")
    private String comentario;
    
    @Column(name = "estado_resultante", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoPregunta estadoResultante;
    
    @CreationTimestamp
    @Column(name = "registrado_en", nullable = false)
    private LocalDateTime registradoEn;
}