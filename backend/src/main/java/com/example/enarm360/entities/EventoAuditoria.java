package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType; // ← ESTE IMPORT FALTA
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "evento_auditoria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoAuditoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private Usuario actor;
    
    @Column(nullable = false, length = 50)
    private String accion;
    
    @Column(nullable = false, length = 50)
    private String entidad;
    
    @Column(name = "entidad_id", columnDefinition = "TEXT")
    private String entidadId;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "JSONB")
    private Map<String, Object> detalles;
    
    @CreationTimestamp
    @Column(name = "ocurrido_en", nullable = false)
    private LocalDateTime ocurridoEn;
}