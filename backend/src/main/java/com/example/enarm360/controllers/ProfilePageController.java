package com.example.enarm360.controllers;

import com.example.enarm360.dtos.profile.UpdateProfileDto;
import com.example.enarm360.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
public class ProfilePageController {

    private final ProfileService profileService;

    @GetMapping("/perfil")
    public String perfil(Model model) {
        model.addAttribute("perfil", profileService.me());
        model.addAttribute("update", new UpdateProfileDto());
        return "perfil";
    }

    @PostMapping("/perfil")
    public String actualizar(@ModelAttribute("update") UpdateProfileDto update) {
        profileService.upsertMyProfile(update);
        return "redirect:/perfil";
    }

    @PostMapping("/perfil/avatar")
public String avatar(@RequestParam("file") MultipartFile file) throws Exception {
    if (!file.isEmpty()) {
        var root = java.nio.file.Path.of("uploads","avatars");
        java.nio.file.Files.createDirectories(root);
        var name = System.currentTimeMillis()+"-"+ org.springframework.util.StringUtils.cleanPath(file.getOriginalFilename());
        java.nio.file.Files.copy(file.getInputStream(), root.resolve(name),
                java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        profileService.setAvatar("/static/avatars/" + name);
    }
    return "redirect:/perfil";
}

}
