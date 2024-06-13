package com.example.livestreaming.mapper;

import com.example.livestreaming.entity.Channel;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.UserDTO;

public class ChannelMapper {
    public static ChannelDTO toChannelDTO(Channel channel) {
        return ChannelDTO.builder()
                .id(channel.getId())
                .streamKey(channel.getStreamKey())
                .channelName(channel.getChannelName())
                .title(channel.getTitle())
                .tags(channel.getTags())
                .isLiveStreaming(channel.isLiveStreaming())
                .enableLLHLS(channel.isEnableLLHLS())
                .user(UserMapper.toUserDTO(channel.getUser()))
                .build();
    }

    public static Channel toChannel(ChannelDTO channelDTO) {
        return Channel.builder()
                .id(channelDTO.getId())
                .streamKey(channelDTO.getStreamKey())
                .channelName(channelDTO.getChannelName())
                .title(channelDTO.getTitle())
                .tags(channelDTO.getTags())
                .isLiveStreaming(channelDTO.isLiveStreaming())
                .enableLLHLS(channelDTO.isEnableLLHLS())
                .user(UserMapper.toUser(channelDTO.getUser()))
                .build();
    }

}
