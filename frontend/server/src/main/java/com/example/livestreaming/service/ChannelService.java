package com.example.livestreaming.service;

import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.UserDTO;

import java.util.List;

public interface ChannelService {
    public User getAuthorizedUser();
    public Boolean checkStreamKey (String streamKey);
    public String generateStreamKey ();
    public ChannelDTO updateChannel(ChannelDTO channelDTO);
    public ChannelDTO startLiveStream ();
    public ChannelDTO stopLiveStream ();
}
