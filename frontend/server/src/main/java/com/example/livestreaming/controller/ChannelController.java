package com.example.livestreaming.controller;

import com.example.livestreaming.payload.*;
import com.example.livestreaming.service.ChannelService;
import com.example.livestreaming.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channel")
@RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    @PostMapping("/check-stream-key")
    public ResponseEntity<Boolean> checkStreamKey (@RequestBody CheckStreamKeyDTO checkStreamKeyDTO) {
        return ResponseEntity.ok(channelService.checkStreamKey(checkStreamKeyDTO.getStreamKey()));
    }
    @PutMapping("/stream-key")
    public ResponseEntity<String> resetStreamKey () {
        return ResponseEntity.ok(channelService.generateStreamKey());
    }
    @GetMapping("/live/all")
    public ResponseEntity<List<PublicChannelDTO>> getAllLiveChannels () {
        return ResponseEntity.ok(channelService.getAllLiveChannels());
    }
    @GetMapping("/get-channel")
    public ResponseEntity<ChannelDTO> getChannel () {
        return ResponseEntity.ok(channelService.getChannel());
    }

    @PutMapping("/update-channel")
    public ResponseEntity<ChannelDTO> updateChannel (@RequestBody ChannelDTO channelDTO) {
        return ResponseEntity.ok(channelService.updateChannel(channelDTO));
    }

    @PostMapping("/live/start")
    public ResponseEntity<ChannelDTO> startLiveStream (@RequestBody CheckStreamKeyDTO checkStreamKeyDTO) {
        return ResponseEntity.ok(channelService.startLiveStream(checkStreamKeyDTO));
    }

    @PostMapping("/live/end")
    public ResponseEntity<ChannelDTO> stopLiveStream (@RequestBody CheckStreamKeyDTO checkStreamKeyDTO) {
        return ResponseEntity.ok(channelService.stopLiveStream(checkStreamKeyDTO));
    }
}
