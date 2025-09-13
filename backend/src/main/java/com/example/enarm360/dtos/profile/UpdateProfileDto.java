package com.example.enarm360.dtos.profile;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateProfileDto {
    // Información personal
    private String nombre;
    private String apellido;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String genero;
    
    // Información académica
    private String universidad;
    private Integer anioGraduacion;
    private String numeroTitulo;
    private String especialidadInteres;
    
    // Información de perfil
    private String bio;
    private String pais;
    private String tz;
    
    // Configuraciones
    private Boolean recibirNotificaciones;
    private Boolean recibirNewsletters;
    private Boolean perfilPublico;
    
    // Configuración de privacidad
    private PrivacySettingsUpdateDto privacy;
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PrivacySettingsUpdateDto {
        private Boolean mostrarEmail;
        private Boolean mostrarTelefono;
        private Boolean mostrarUniversidad;
        private Boolean permitirMensajes;
        private Boolean mostrarEstadisticas;
    }
}
