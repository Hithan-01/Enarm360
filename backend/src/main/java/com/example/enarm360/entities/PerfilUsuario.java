package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "perfil_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilUsuario {
    
    @Id
    @Column(name = "usuario_id")
    private Long usuarioId;
    
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(length = 30)
    private String telefono;
    
    @Column(length = 80)
    private String pais;
    
    @Builder.Default
    @Column(length = 64)
    private String tz = "America/Monterrey";
    
    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;
    
    // Relación con Usuario
    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}