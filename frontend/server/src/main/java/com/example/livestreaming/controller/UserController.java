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
    @GetMapping
    public ResponseEntity<String> getUsers () {
        return ResponseEntity.ok("server enabled");
    }
    @GetMapping("/token/{id}")
    public ResponseEntity<List<String>> getValidToken (@PathVariable Integer id) {
        var list = userService.getToken(id);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUser () {
        return ResponseEntity.ok(userService.getUser());
    }

    @GetMapping("/hello")
    public ResponseEntity<String> sayHelloFromServer () {
        return ResponseEntity.ok("Hello from server");
    }
    @PostMapping("/check-stream-key")
    public ResponseEntity<Boolean> checkStreamKey (@RequestBody CheckStreamKeyDTO checkStreamKeyDTO) {
        return ResponseEntity.ok(channelService.checkStreamKey(checkStreamKeyDTO.getStreamKey()));
    }
    @PutMapping("/stream-key")
    public ResponseEntity<String> resetStreamKey () {
        return ResponseEntity.ok(channelService.generateStreamKey());
    }
    @PutMapping("/update-profile")
    public ResponseEntity<UserDTO> updateProfile (@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateProfile(userDTO));
    }
    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword (@RequestBody UpdatePasswordDTO updatePasswordDTO) {
        return ResponseEntity.ok(userService.updatePassword(updatePasswordDTO.getOldPassword(), updatePasswordDTO.getNewPassword()));
    }
    @PutMapping("/update-channel")
    public ResponseEntity<ChannelDTO> updateChannel (@RequestBody ChannelDTO channelDTO) {
        return ResponseEntity.ok(channelService.updateChannel(channelDTO));
    }
    @PostMapping("/start-live-stream")
    public ResponseEntity<ChannelDTO> startLiveStream () {
        return ResponseEntity.ok(channelService.startLiveStream());
    }
    @PostMapping("/stop-live-stream")
    public ResponseEntity<ChannelDTO> stopLiveStream () {
        return ResponseEntity.ok(channelService.stopLiveStream());
    }
}
