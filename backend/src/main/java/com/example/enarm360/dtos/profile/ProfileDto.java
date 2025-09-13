package com.example.enarm360.dtos.profile;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfileDto {
    // Identificación
    private Long id;
    private String email;
    private String username;
    
    // Información personal  
    private String nombre;
    private String apellido;
    private String telefono;
    private String avatar;
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
    
    // Configuraciones (valores por defecto)
    @Builder.Default
    private Boolean recibirNotificaciones = true;
    @Builder.Default
    private Boolean recibirNewsletters = false;
    @Builder.Default
    private Boolean perfilPublico = true;
    
    // Metadata del sistema
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimaActividad;
    private String estado;
    @Builder.Default
    private Boolean emailVerificado = false;
    
    // Roles
    private Set<String> roles;
    
    // Configuración de privacidad (valores por defecto)
    @Builder.Default
    private PrivacySettingsDto privacy = new PrivacySettingsDto();
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PrivacySettingsDto {
        @Builder.Default
        private Boolean mostrarEmail = false;
        @Builder.Default
        private Boolean mostrarTelefono = false;
        @Builder.Default
        private Boolean mostrarUniversidad = true;
        @Builder.Default
        private Boolean permitirMensajes = true;
        @Builder.Default
        private Boolean mostrarEstadisticas = true;
    }
}
