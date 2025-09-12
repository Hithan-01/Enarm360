package com.example.enarm360.controllers;

import com.example.enarm360.dtos.profile.ProfileDto;
import com.example.enarm360.dtos.profile.UpdateProfileDto;
import com.example.enarm360.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;

@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class UserProfileController {

    private final ProfileService svc;

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> me() {
        return ResponseEntity.ok(svc.me());
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDto> update(@RequestBody UpdateProfileDto req) {
        return ResponseEntity.ok(svc.upsertMyProfile(req));
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<ProfileDto> byUser(@PathVariable Long id) {
        return ResponseEntity.ok(svc.byUserId(id));
    }

    @PostMapping(value="/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileDto> avatar(@RequestPart("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) return ResponseEntity.badRequest().build();
        Path root = Path.of("uploads","avatars");
        Files.createDirectories(root);
        String name = System.currentTimeMillis()+"-"+ StringUtils.cleanPath(file.getOriginalFilename());
        Files.copy(file.getInputStream(), root.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        return ResponseEntity.ok(svc.setAvatar("/static/avatars/"+name));
    }
}
