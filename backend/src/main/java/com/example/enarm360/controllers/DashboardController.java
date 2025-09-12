package com.example.enarm360.controllers;

import com.example.enarm360.services.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private AuthService authService;

    // ==========================================================
    // DASHBOARD PARA ADMINISTRADORES
    // ==========================================================

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDashboard() {
        try {
            logger.debug("Acceso a dashboard admin");
            
            Map<String, Object> adminData = Map.of(
                "message", "Bienvenido Administrador",
                "stats", Map.of(
                    "usuariosActivos", 150,
                    "preguntasTotales", 1250,
                    "examenesCreados", 45,
                    "preguntasPendientes", 23,
                    "usuariosUltimoMes", 38
                ),
                "actions", new String[]{
                    "Gestionar usuarios", 
                    "Ver reportes", 
                    "Administrar contenido",
                    "Revisar preguntas",
                    "Configurar sistema"
                },
                "accessLevel", "ADMIN",
                "quickLinks", Map.of(
                    "usuarios", "/admin/usuarios",
                    "preguntas", "/admin/preguntas",
                    "reportes", "/admin/reportes"
                )
            );
            
            return ResponseEntity.ok(adminData);
            
        } catch (Exception e) {
            logger.error("Error en admin dashboard: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Acceso denegado: Se requiere rol ADMIN",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // DASHBOARD PARA ESTUDIANTES
    // ==========================================================

    @GetMapping("/estudiante")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<?> estudianteDashboard() {
        try {
            logger.debug("Acceso a dashboard estudiante");
            
            Map<String, Object> estudianteData = Map.of(
                "message", "Bienvenido Estudiante",
                "stats", Map.of(
                    "examenesCompletados", 12,
                    "puntuacionPromedio", 85.5,
                    "tiempoEstudio", "24 horas",
                    "racha", 7,
                    "posicionRanking", 45
                ),
                "actions", new String[]{
                    "Tomar exámenes", 
                    "Ver progreso", 
                    "Revisar resultados",
                    "Practicar flashcards",
                    "Ver estadísticas"
                },
                "accessLevel", "ESTUDIANTE",
                "quickLinks", Map.of(
                    "examenes", "/examenes",
                    "progreso", "/progreso",
                    "flashcards", "/flashcards"
                ),
                "proximosExamenes", new String[]{
                    "Cardiología - Nivel Intermedio",
                    "Neurología - Casos Clínicos",
                    "Simulacro ENARM - Completo"
                }
            );
            
            return ResponseEntity.ok(estudianteData);
            
        } catch (Exception e) {
            logger.error("Error en estudiante dashboard: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Acceso denegado: Se requiere rol ESTUDIANTE",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // DASHBOARD GENERAL (AMBOS ROLES)
    // ==========================================================

    @GetMapping("/general")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESTUDIANTE')")
    public ResponseEntity<?> generalDashboard() {
        try {
            logger.debug("Acceso a dashboard general");
            
            Set<String> roles = authService.getCurrentUserRoles();
            boolean isAdmin = roles.contains("ROLE_ADMIN");
            
            Map<String, Object> generalData = Map.of(
                "message", isAdmin ? "Bienvenido Administrador" : "Bienvenido Estudiante",
                "userRole", isAdmin ? "ADMIN" : "ESTUDIANTE",
                "features", isAdmin ? 
                    new String[]{"Gestión de usuarios", "Reportes", "Administración"} :
                    new String[]{"Tomar exámenes", "Ver progreso", "Resultados"},
                "notifications", isAdmin ?
                    new String[]{"5 usuarios nuevos", "12 preguntas pendientes", "3 reportes sin revisar"} :
                    new String[]{"Nuevo examen disponible", "Racha de 7 días", "Mejoraste tu promedio"},
                "systemStatus", Map.of(
                    "online", true,
                    "maintenance", false,
                    "version", "1.0.0"
                )
            );
            
            return ResponseEntity.ok(generalData);
            
        } catch (Exception e) {
            logger.error("Error en dashboard general: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "message", "Acceso denegado",
                        "success", false
                    ));
        }
    }

    // ==========================================================
    // DASHBOARD CON ESTADÍSTICAS PERSONALIZADAS
    // ==========================================================

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESTUDIANTE')")
    public ResponseEntity<?> getPersonalizedStats() {
        try {
            logger.debug("Solicitud de estadísticas personalizadas");
            
            Set<String> roles = authService.getCurrentUserRoles();
            boolean isAdmin = roles.contains("ROLE_ADMIN");
            
            Map<String, Object> stats;
            
            if (isAdmin) {
                stats = Map.of(
                    "tipo", "admin",
                    "periodo", "últimos 30 días",
                    "usuarios", Map.of(
                        "nuevos", 38,
                        "activos", 150,
                        "inactivos", 12
                    ),
                    "contenido", Map.of(
                        "preguntasCreadas", 45,
                        "preguntasAprobadas", 38,
                        "preguntasRechazadas", 7
                    ),
                    "actividad", Map.of(
                        "loginsDiarios", 234,
                        "examenesRealizados", 89,
                        "tiempoPromedioSesion", "25 minutos"
                    )
                );
            } else {
                stats = Map.of(
                    "tipo", "estudiante",
                    "periodo", "últimos 30 días",
                    "rendimiento", Map.of(
                        "examenesRealizados", 12,
                        "puntuacionPromedio", 85.5,
                        "mejorPuntuacion", 94.0,
                        "tiempoPromedio", "45 minutos"
                    ),
                    "progreso", Map.of(
                        "temasEstudiados", 23,
                        "temasCompletados", 18,
                        "horasEstudio", 24.5
                    ),
                    "objetivos", Map.of(
                        "metaMensual", 20,
                        "avanceActual", 12,
                        "porcentajeAvance", 60
                    )
                );
            }
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas personalizadas: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Error al obtener estadísticas",
                        "success", false
                    ));
        }
    }
}