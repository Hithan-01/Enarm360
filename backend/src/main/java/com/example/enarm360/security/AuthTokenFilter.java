package com.example.enarm360.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {
    
    try {
        String jwt = parseJwt(request);
        logger.info("Processing request: {} - JWT: {}", request.getRequestURI(), jwt != null ? "present" : "null");
        
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUsernameFromJwtToken(jwt);
            logger.info("Username from JWT: {}", username);
            
            if (username != null) {
                UserDetails userDetails = userDetailsService.loadUserByUsernameOnly(username);
                
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, 
                            null, 
                            userDetails.getAuthorities()
                        );
                    
                    authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Authentication set successfully for user: {}", username);
                } else {
                    logger.warn("UserDetails is null for username: {}", username);
                }
            }
        } else {
            logger.warn("JWT validation failed or JWT is null");
        }
    } catch (Exception e) {
        logger.error("Cannot set user authentication: {}", e.getMessage(), e);
        SecurityContextHolder.clearContext();
    }

    filterChain.doFilter(request, response);
}
    /**
     * Extraer JWT del header Authorization
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }

    /**
     * Determinar si el filtro debe aplicarse para esta request
     */
@Override
protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getRequestURI();
    
    // Lista específica de endpoints públicos
    return path.equals("/api/auth/login") || 
           path.equals("/api/auth/register") ||
           path.equals("/api/auth/refresh") ||
           path.equals("/api/auth/check-availability") ||
           path.equals("/api/auth/check-email") ||
           path.equals("/api/auth/check-username") ||
           path.startsWith("/api/public/") ||
           path.startsWith("/actuator/") ||
           path.equals("/error") ||
           // Rutas estáticas del frontend
           path.equals("/") ||
           path.equals("/index.html") ||
           path.equals("/favicon.ico") ||
           path.equals("/manifest.json") ||
           path.startsWith("/static/") ||
           path.startsWith("/login") ||
           path.startsWith("/admin/") ||
           path.startsWith("/estudiante/");
}
}