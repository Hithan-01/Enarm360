package com.example.enarm360.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "casos_de_estudio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CasoEstudio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "id_caso", nullable = false, unique = true, length = 50)
    @NotBlank(message = "El ID del caso es obligatorio")
    private String idCaso;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "El contenido del caso es obligatorio")
    private String caso;
    
    @Column(length = 255)
    private String imagen;
    
    // Relación con usuario (tu entidad Usuario ya existente)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({"casosEstudio", "reactivos", "preguntasCasos"})
    private Usuario usuario;
    
    @Column(name = "fecha_hora", nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaHora;
    
    // Relación con preguntas del caso
    @OneToMany(mappedBy = "casoEstudio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("casoEstudio")
    private List<PreguntaCaso> preguntas;
}
