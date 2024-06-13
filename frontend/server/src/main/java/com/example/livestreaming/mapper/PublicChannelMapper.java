package com.example.livestreaming.mapper;

import com.example.livestreaming.entity.Channel;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.PublicChannelDTO;

public class PublicChannelMapper {
    public static PublicChannelDTO toPublicChannelDTO(Channel channel) {
        return PublicChannelDTO.builder()
                .id(channel.getId())
                .channelName(channel.getChannelName())
                .title(channel.getTitle())
                .tags(channel.getTags())
                .isLiveStreaming(channel.isLiveStreaming())
                .build();
    }
}
