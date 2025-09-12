package com.example.enarm360.dtos.registrer;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordValidationResponse {
    
    private boolean valido;
    private String mensaje;
    private String fortaleza; // debil, media, fuerte
    private PasswordChecks checks;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PasswordChecks {
        private boolean tieneMinimo8Caracteres;
        private boolean tieneMayuscula;
        private boolean tieneMinuscula; 
        private boolean tieneNumero;
        private int puntaje; // 0-4 según criterios cumplidos
    }
}