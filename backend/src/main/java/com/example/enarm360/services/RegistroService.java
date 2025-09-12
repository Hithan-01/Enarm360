package com.example.enarm360.services;
import com.example.enarm360.dtos.registrer.PasswordValidationResponse;
import com.example.enarm360.dtos.registrer.RegistroInfoResponse;
import com.example.enarm360.dtos.registrer.RegistroRequest;
import com.example.enarm360.dtos.registrer.RegistroResponse;
import com.example.enarm360.entities.*;
import com.example.enarm360.repositories.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class RegistroService {
    
    private static final Logger logger = LoggerFactory.getLogger(RegistroService.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PerfilUsuarioRepository perfilUsuarioRepository;
    
    @Autowired
    private RolRepository rolRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Registrar nuevo usuario (solo estudiantes)
     */
    /**
 * Registrar nuevo usuario (solo estudiantes)
 */
public RegistroResponse registrarUsuario(RegistroRequest request) {
    logger.info("Iniciando registro para: {}", request.getEmail());
    
    try {
        // 1. Crear Usuario
        Usuario usuario = Usuario.builder()
            .email(request.getEmail().toLowerCase().trim())
            .username(request.getUsername().toLowerCase().trim())
            .contrasenaHash(passwordEncoder.encode(request.getContrasena()))
            .nombre(request.getNombre().trim())
            .apellidos(request.getApellidos() != null ? request.getApellidos().trim() : null)
            .activo(true)
            // No necesitas setear creadoEn y actualizadoEn porque usas @CreationTimestamp y @UpdateTimestamp
            .build();
            
        // 2. Asignar rol ESTUDIANTE antes de guardar
        Rol rolEstudiante = rolRepository.findByNombre("ESTUDIANTE")
            .orElseThrow(() -> new RuntimeException("Rol ESTUDIANTE no encontrado"));
        
        // Agregar rol al Set de roles
        usuario.getRoles().add(rolEstudiante);
        
        // Guardar usuario con rol
        usuario = usuarioRepository.save(usuario);
        
        // 3. Crear Perfil asociado
        PerfilUsuario perfil = PerfilUsuario.builder()
            .usuario(usuario) // Usar la relación @OneToOne en lugar de usuarioId
            .telefono(request.getTelefono())
            .pais(request.getPais())
            .tz("America/Monterrey")
            // actualizadoEn se setea automáticamente si tienes @UpdateTimestamp
            .build();
            
        perfilUsuarioRepository.save(perfil);
        
        logger.info("Usuario registrado: {} (ID: {})", usuario.getEmail(), usuario.getId());
        
        return RegistroResponse.builder()
            .id(usuario.getId())
            .nombre(usuario.getNombre())
            .apellidos(usuario.getApellidos())
            .email(usuario.getEmail())
            .username(usuario.getUsername())
            .activo(usuario.getActivo())
            .creadoEn(usuario.getCreadoEn())
            .mensaje("Usuario registrado exitosamente")
            .success(true)
            .build();
            
    } catch (Exception e) {
        logger.error("Error al registrar usuario: {}", e.getMessage());
        throw new RuntimeException("Error al crear cuenta: " + e.getMessage());
    }
}

/**
 * Info básica para formulario
 */
public RegistroInfoResponse getInformacionRegistro() {
    
    List<String> paises = Arrays.asList(
        "México", "Estados Unidos", "España", "Colombia", "Argentina", 
        "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Otro"
    );
    
    return RegistroInfoResponse.builder()
        .paises(paises)
        .passwordRequirements(RegistroInfoResponse.PasswordRequirementsDTO.getDefault())
        .build();
}
    
    /**
     * Validar fortaleza de contraseña
     */
    public PasswordValidationResponse validarPassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return PasswordValidationResponse.builder()
                .valido(false)
                .mensaje("Contraseña es requerida")
                .fortaleza("ninguna")
                .build();
        }
        
        boolean tieneMinimo8 = password.length() >= 8;
        boolean tieneMayuscula = password.matches(".*[A-Z].*");
        boolean tieneMinuscula = password.matches(".*[a-z].*");
        boolean tieneNumero = password.matches(".*\\d.*");
        
        int puntaje = 0;
        if (tieneMinimo8) puntaje++;
        if (tieneMayuscula) puntaje++;
        if (tieneMinuscula) puntaje++;
        if (tieneNumero) puntaje++;
        
        boolean esValida = puntaje >= 4; // Requiere todos los criterios
        
        String fortaleza;
        String mensaje;
        
        if (puntaje >= 4) {
            fortaleza = "fuerte";
            mensaje = "Contraseña fuerte";
        } else if (puntaje >= 3) {
            fortaleza = "media";
            mensaje = "Contraseña media - falta algún criterio";
        } else {
            fortaleza = "debil";
            mensaje = "Contraseña débil - cumple pocos criterios";
        }
        
        PasswordValidationResponse.PasswordChecks checks = 
            PasswordValidationResponse.PasswordChecks.builder()
                .tieneMinimo8Caracteres(tieneMinimo8)
                .tieneMayuscula(tieneMayuscula)
                .tieneMinuscula(tieneMinuscula)
                .tieneNumero(tieneNumero)
                .puntaje(puntaje)
                .build();
        
        return PasswordValidationResponse.builder()
            .valido(esValida)
            .mensaje(mensaje)
            .fortaleza(fortaleza)
            .checks(checks)
            .build();
    }
}