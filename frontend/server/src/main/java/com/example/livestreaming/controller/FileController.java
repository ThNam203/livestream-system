package com.example.livestreaming.controller;

import com.example.livestreaming.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {
    private final UserService userService;
    @GetMapping
    public ResponseEntity<String> sayHelloFromServer () {
        return ResponseEntity.ok("Test getting file from server");
    }

}
