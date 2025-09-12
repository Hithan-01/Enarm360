package com.example.enarm360.dtos.profile;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfileDto {
    private Long usuarioId;
    private String email;
    private String username;
    private String nombreCompleto;
    private String avatarUrl;
    private String bio;
    private String telefono;
    private String pais;
    private String tz;
}
