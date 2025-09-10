package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "sesion_auth")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SesionAuth {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(name = "token_refresh", unique = true, nullable = false, columnDefinition = "TEXT")
    private String tokenRefresh;
    
    @CreationTimestamp
    @Column(name = "emitido_en", nullable = false)
    private LocalDateTime emitidoEn;
    
    @Column(name = "expira_en", nullable = false)
    private LocalDateTime expiraEn;
}