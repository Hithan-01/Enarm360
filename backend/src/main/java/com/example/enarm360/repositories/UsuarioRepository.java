package com.example.enarm360.repositories;

import com.example.enarm360.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

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


}
