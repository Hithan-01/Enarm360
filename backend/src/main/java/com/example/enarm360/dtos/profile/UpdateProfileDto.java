package com.example.enarm360.dtos.profile;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateProfileDto {
    private String bio;
    private String telefono;
    private String pais;
    private String tz;
}
