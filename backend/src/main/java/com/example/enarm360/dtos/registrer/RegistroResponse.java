package com.example.enarm360.dtos.registrer;

import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroResponse {
    
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String username;
    private boolean activo;
    private LocalDateTime creadoEn;
    private String mensaje;
    private boolean success;
}
