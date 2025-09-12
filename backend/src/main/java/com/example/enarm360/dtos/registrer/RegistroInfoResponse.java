package com.example.enarm360.dtos.registrer;
import java.util.List;
import lombok.*;

@Data
@NoArgsConstructor 
@AllArgsConstructor
@Builder
public class RegistroInfoResponse {
    
    private List<String> paises;
    private PasswordRequirementsDTO passwordRequirements;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PasswordRequirementsDTO {
        private int minimoCaracteres;
        private boolean requiereMayuscula;
        private boolean requiereMinuscula;
        private boolean requiereNumero;
        private String mensaje;
        
        public static PasswordRequirementsDTO getDefault() {
            return PasswordRequirementsDTO.builder()
                .minimoCaracteres(8)
                .requiereMayuscula(true)
                .requiereMinuscula(true)
                .requiereNumero(true)
                .mensaje("Mínimo 8 caracteres, una mayúscula, una minúscula y un número")
                .build();
        }
    }
}
