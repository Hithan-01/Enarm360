package com.example.enarm360.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.enarm360.entities.SesionAuth;

import jakarta.transaction.Transactional;

@Repository
public interface SesionAuthRepository extends JpaRepository<SesionAuth, Long> {
    
    Optional<SesionAuth> findByTokenRefresh(String tokenRefresh);
    
    void deleteByTokenRefresh(String tokenRefresh);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM SesionAuth s WHERE s.usuario.id = :usuarioId")
    void deleteAllByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    @Modifying
    @Transactional  // ← ESTAS DOS ANOTACIONES SON CRÍTICAS
    @Query("DELETE FROM SesionAuth s WHERE s.expiraEn < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(s) FROM SesionAuth s WHERE s.usuario.id = :usuarioId")
    Long countActiveSessionsByUsuario(@Param("usuarioId") Long usuarioId);
}