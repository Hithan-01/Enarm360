package com.example.enarm360.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.enarm360.entities.PerfilUsuario;

@Repository
public interface PerfilUsuarioRepository extends JpaRepository<PerfilUsuario, Long> {
    
    Optional<PerfilUsuario> findByUsuarioId(Long usuarioId);
}