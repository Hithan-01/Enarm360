package com.example.enarm360.repositories;

import com.example.enarm360.entities.UsuarioPermisoLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UsuarioPermisoLogRepository extends JpaRepository<UsuarioPermisoLog, Long> {

    @Query("SELECT l FROM UsuarioPermisoLog l WHERE l.usuario.id = :userId ORDER BY l.creadoEn DESC")
    Page<UsuarioPermisoLog> findByUsuarioIdOrderByCreadoEnDesc(Long userId, Pageable pageable);

    @Query("SELECT l FROM UsuarioPermisoLog l WHERE l.usuario.id = :userId AND l.permiso.codigo = :codigo ORDER BY l.creadoEn DESC")
    List<UsuarioPermisoLog> findTopByUsuarioAndPermisoOrderByCreadoEnDesc(Long userId, String codigo, Pageable pageable);
}
