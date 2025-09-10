package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 150)
    private String email;
    
    @Column(name = "contrasena_hash", nullable = false, length = 255)
    private String contrasenaHash;
    
    @Column(nullable = false, length = 120)
    private String nombre;
    
    @Column(length = 120)
    private String apellidos;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;
    
    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;
    
    // Relaciones Many-to-Many
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "usuario_rol",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    @Builder.Default
    private Set<Rol> roles = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "usuario_permiso",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    @Builder.Default
    private Set<Permiso> permisos = new HashSet<>();
    
    // Relaciones One-to-One y One-to-Many
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PerfilUsuario perfil;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @Builder.Default
    private List<SesionAuth> sesiones = new ArrayList<>();
    
    @OneToMany(mappedBy = "actor")
    @Builder.Default
    private List<EventoAuditoria> eventosAuditoria = new ArrayList<>();
    
    @OneToMany(mappedBy = "creadoPor")
    @Builder.Default
    private List<CasoClinico> casosCreados = new ArrayList<>();
    
    @OneToMany(mappedBy = "creadaPor")
    @Builder.Default
    private List<Pregunta> preguntasCreadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "revisadaPor")
    @Builder.Default
    private List<Pregunta> preguntasRevisadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "aprobadaPor")
    @Builder.Default
    private List<Pregunta> preguntasAprobadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "revisor")
    @Builder.Default
    private List<RevisionPregunta> revisionesRealizadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "creadoPor")
    @Builder.Default
    private List<Examen> examenesCreados = new ArrayList<>();
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @Builder.Default
    private List<IntentoExamen> intentosExamen = new ArrayList<>();
    
    @OneToMany(mappedBy = "creadaPor")
    @Builder.Default
    private List<Flashcard> flashcardsCreadas = new ArrayList<>();
}