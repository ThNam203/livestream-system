package com.example.livestreaming.controller;

import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.CheckStreamKeyDTO;
import com.example.livestreaming.payload.UpdatePasswordDTO;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.service.ChannelService;
import com.example.livestreaming.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ChannelService channelService;

    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUser () {
        return ResponseEntity.ok(userService.getUser());
    }
    @PutMapping("/update-profile")
    public ResponseEntity<UserDTO> updateProfile (@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateProfile(userDTO));
    }
    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword (@RequestBody UpdatePasswordDTO updatePasswordDTO) {
        return ResponseEntity.ok(userService.updatePassword(updatePasswordDTO.getOldPassword(), updatePasswordDTO.getNewPassword()));
    }
}
