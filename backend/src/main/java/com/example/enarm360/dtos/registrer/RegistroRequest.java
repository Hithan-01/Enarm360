package com.example.enarm360.dtos.registrer;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 120, message = "El nombre debe tener entre 2 y 120 caracteres")
    private String nombre;
    
    @Size(max = 120, message = "Los apellidos no pueden exceder 120 caracteres")
    private String apellidos;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    @Size(max = 150, message = "El email no puede exceder 150 caracteres")
    private String email;
    
    @NotBlank(message = "El username es obligatorio")
    @Size(min = 3, max = 150, message = "El username debe tener entre 3 y 150 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username solo puede contener letras, números, puntos, guiones y guiones bajos")
    private String username;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener mínimo 8 caracteres")
    private String contrasena;
    
    @NotBlank(message = "Confirmar contraseña es obligatorio")
    private String confirmarContrasena;
    
    // Campos opcionales del perfil
    private String telefono;
    private String pais;
    
    @AssertTrue(message = "Las contraseñas no coinciden")
    public boolean isPasswordMatching() {
        return contrasena != null && contrasena.equals(confirmarContrasena);
    }
}
