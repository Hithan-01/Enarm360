package com.example.enarm360.repositories;

import com.example.enarm360.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar por username O email (acepta ambos)
    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permisos LEFT JOIN FETCH u.permisos " +
           "WHERE (u.username = :login OR u.email = :login) AND u.activo = true")
    Optional<Usuario> findByUsernameOrEmailAndActivoTrueWithRolesAndPermisos(@Param("login") String login);
    
    // Métodos individuales por username
    Optional<Usuario> findByUsernameAndActivoTrue(String username);
    Boolean existsByUsername(String username);
    
    // Métodos individuales por email
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByEmailAndActivoTrue(String email);
    Boolean existsByEmail(String email);
    
    // Método que busca por username O email
    @Query("SELECT u FROM Usuario u WHERE (u.username = :login OR u.email = :login) AND u.activo = true")
    Optional<Usuario> findByUsernameOrEmailAndActivoTrue(@Param("login") String login);
    
    @Query("SELECT u FROM Usuario u WHERE u.activo = true")
    List<Usuario> findAllActiveUsers();

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<Usuario> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.roles WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<Usuario> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail, @Param("usernameOrEmail") String usernameOrEmail2);

    @Query("SELECT u FROM Usuario u WHERE u.currentSubscription.endDate IS NOT NULL " +
           "AND u.currentSubscription.endDate BETWEEN :start AND :end " +
           "AND u.currentSubscription.status = 'ACTIVE'")
    List<Usuario> findUsersWithSubscriptionsExpiringBetween(
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    /**
     * Encuentra usuarios por estado de suscripción
     */
    @Query("SELECT u FROM Usuario u WHERE u.subscriptionStatus = :status")
    List<Usuario> findBySubscriptionStatus(@Param("status") Usuario.SubscriptionStatus status);
    
    /**
     * Encuentra usuarios con suscripciones activas
     */
    @Query("SELECT u FROM Usuario u WHERE u.currentSubscription IS NOT NULL " +
           "AND u.currentSubscription.status = 'ACTIVE' " +
           "AND (u.currentSubscription.endDate IS NULL OR u.currentSubscription.endDate > CURRENT_TIMESTAMP)")
    List<Usuario> findUsersWithActiveSubscriptions();
    
    /**
     * Cuenta usuarios por estado de suscripción
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.subscriptionStatus = :status")
    Integer countBySubscriptionStatus(@Param("status") Usuario.SubscriptionStatus status);
    
    /**
     * Cuenta usuarios activos/inactivos
     */
    Integer countByActivo(Boolean activo);
    
    /**
     * Encuentra usuarios con un plan específico activo
     */
    @Query("SELECT u FROM Usuario u WHERE u.currentSubscription.plan.id = :planId " +
           "AND u.currentSubscription.status = 'ACTIVE'")
    List<Usuario> findUsersWithActivePlan(@Param("planId") Long planId);
    
    /**
     * Búsqueda de usuarios por término (nombre, email, username)
     */
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombre) LIKE :searchTerm OR " +
           "LOWER(u.apellidos) LIKE :searchTerm OR " +
           "LOWER(u.email) LIKE :searchTerm OR " +
           "LOWER(u.username) LIKE :searchTerm")
    List<Usuario> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    /**
     * Encuentra usuarios que nunca han tenido una suscripción
     */
    @Query("SELECT u FROM Usuario u WHERE u.currentSubscription IS NULL " +
           "AND u.subscriptionStatus = 'FREE'")
    List<Usuario> findUsersWithoutSubscription();
    
    /**
     * Encuentra usuarios con suscripciones canceladas
     */
    @Query("SELECT u FROM Usuario u WHERE u.subscriptionStatus = 'CANCELLED'")
    List<Usuario> findUsersWithCancelledSubscriptions();
    
    /**
     * Encuentra usuarios con suscripciones expiradas
     */
    @Query("SELECT u FROM Usuario u WHERE u.subscriptionStatus = 'EXPIRED'")
    List<Usuario> findUsersWithExpiredSubscriptions();
    
    /**
     * Cuenta usuarios registrados en un rango de fechas
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.creadoEn BETWEEN :start AND :end")
    Integer countUsersRegisteredBetween(
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    /**
     * Encuentra usuarios por rol específico
     */
    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r.nombre = :roleName")
    List<Usuario> findByRoleName(@Param("roleName") String roleName);
    
    /**
     * Encuentra usuarios activos registrados recientemente
     */
    @Query("SELECT u FROM Usuario u WHERE u.activo = true " +
           "AND u.creadoEn >= :since ORDER BY u.creadoEn DESC")
    List<Usuario> findRecentActiveUsers(@Param("since") LocalDateTime since);
    
    /**
     * Encuentra usuarios que necesitan renovación (próximos X días)
     */
    @Query("SELECT u FROM Usuario u WHERE u.currentSubscription IS NOT NULL " +
           "AND u.currentSubscription.status = 'ACTIVE' " +
           "AND u.currentSubscription.endDate BETWEEN CURRENT_TIMESTAMP AND :renewalDate " +
           "AND u.currentSubscription.autoRenew = true")
    List<Usuario> findUsersForRenewal(@Param("renewalDate") LocalDateTime renewalDate);
}