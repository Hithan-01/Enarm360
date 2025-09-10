package com.example.enarm360.security;

import com.example.enarm360.entities.Usuario;
import com.example.enarm360.entities.Rol;
import com.example.enarm360.entities.Permiso;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellidos;
    private String password;
    private boolean activo;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String nombre, String apellidos, 
                          String password, boolean activo,
                          Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.password = password;
        this.activo = activo;
        this.authorities = authorities;
    }

    /**
     * Método estático para construir UserDetailsImpl desde Usuario
     */
    public static UserDetailsImpl build(Usuario usuario) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Agregar roles con prefijo ROLE_
        for (Rol rol : usuario.getRoles()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + rol.getNombre()));
            
            // Agregar permisos del rol
            for (Permiso permiso : rol.getPermisos()) {
                authorities.add(new SimpleGrantedAuthority(permiso.getCodigo()));
            }
        }

        // Agregar permisos directos del usuario
        for (Permiso permiso : usuario.getPermisos()) {
            authorities.add(new SimpleGrantedAuthority(permiso.getCodigo()));
        }

        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getContrasenaHash(),
                usuario.getActivo(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;  // Retorna el username (no el email)
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return activo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }

    // Getters adicionales
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public boolean isActivo() {
        return activo;
    }

    /**
     * Método para identificar si el login fue con email o username
     */
    public String getLoginIdentifier(String loginInput) {
        if (loginInput.equals(this.username)) {
            return "username";
        } else if (loginInput.equals(this.email)) {
            return "email";
        }
        return "unknown";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "UserDetailsImpl{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", nombre='" + nombre + '\'' +
                ", activo=" + activo +
                '}';
    }
}