package com.example.enarm360.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permiso")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permiso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 80)
    private String codigo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    // Relaciones Many-to-Many
    @ManyToMany(mappedBy = "permisos", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Rol> roles = new HashSet<>();
    
    @ManyToMany(mappedBy = "permisos", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Usuario> usuarios = new HashSet<>();
}