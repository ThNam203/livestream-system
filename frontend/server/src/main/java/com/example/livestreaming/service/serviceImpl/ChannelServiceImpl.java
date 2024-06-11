package com.example.livestreaming.service.serviceImpl;

import com.example.livestreaming.entity.Token;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.mapper.ChannelMapper;
import com.example.livestreaming.mapper.UserMapper;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.repository.ChannelRepository;
import com.example.livestreaming.repository.TokenRepository;
import com.example.livestreaming.repository.UserRepository;
import com.example.livestreaming.service.ChannelService;
import com.example.livestreaming.service.KeyGenerationService;
import com.example.livestreaming.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChannelServiceImpl implements ChannelService {
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final KeyGenerationService keyGenerationService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getAuthorizedUser() {
        var name = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(name).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Boolean checkStreamKey(String streamKey) {
        return channelRepository.findByStreamKey(streamKey).isPresent();
    }

    @Override
    public String generateStreamKey() {
        String newStreamKey = keyGenerationService.generateStreamKey();

        //Update the stream key in the database
        var user = getAuthorizedUser();
        var updatedChannel = user.getChannel();
        updatedChannel.setStreamKey(newStreamKey);
        user.setChannel(updatedChannel);
        userRepository.save(user);
        return user.getChannel().getStreamKey();
    }
    @Override
    public ChannelDTO updateChannel(ChannelDTO channelDTO) {
        var user = getAuthorizedUser();
        var channel = user.getChannel();
        channel.setTitle(channelDTO.getTitle());
        channel.setChannelName(channelDTO.getChannelName());
        channel.setTags(channelDTO.getTags());
        channel.setEnableLLHLS(channelDTO.isEnableLLHLS());
        user.setChannel(channel);
        userRepository.save(user);
        return channelDTO;
    }
    @Override
    public ChannelDTO startLiveStream() {
        var user = getAuthorizedUser();
        var channel = user.getChannel();
        channel.setLiveStreaming(true);
        user.setChannel(channel);
        userRepository.save(user);
        return ChannelMapper.toChannelDTO(channel);
    }
    @Override
    public ChannelDTO stopLiveStream() {
        var user = getAuthorizedUser();
        var channel = user.getChannel();
        channel.setLiveStreaming(false);
        user.setChannel(channel);
        userRepository.save(user);
        return ChannelMapper.toChannelDTO(channel);
    }
}
