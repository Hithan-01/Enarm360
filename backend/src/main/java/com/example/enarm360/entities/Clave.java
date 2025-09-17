package com.example.enarm360.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Entity
@Table(name = "claves")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clave {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    @NotBlank(message = "El nombre de la clave es obligatorio")
    private String nombre;
    
    // Relación con especialidad
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id", nullable = false)
    @JsonIgnoreProperties({"claves", "reactivos", "preguntasCasos"})
    private Especialidad especialidad;
    
    // Relación con reactivos
    @OneToMany(mappedBy = "clave", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("clave")
    private List<Reactivo> reactivos;
    
    // Relación con preguntas de casos
    @OneToMany(mappedBy = "clave", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("clave")
    private List<PreguntaCaso> preguntasCasos;
}
