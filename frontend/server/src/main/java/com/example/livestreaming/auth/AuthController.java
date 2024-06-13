package com.example.livestreaming.auth;

import com.example.livestreaming.payload.LoginDTO;
import com.example.livestreaming.payload.RegisterDTO;
import com.example.livestreaming.payload.UserDTO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    public final AuthenticationService service;
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> register (@RequestBody RegisterDTO request, HttpServletResponse response) {
        return ResponseEntity.ok(service.register(request, response));
    }

    @PostMapping
    public ResponseEntity<UserDTO> authentication (@RequestBody LoginDTO request, HttpServletResponse response) {
        return ResponseEntity.ok(service.authenticate(request, response));
    }
}
