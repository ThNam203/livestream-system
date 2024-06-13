package com.example.livestreaming.service;

import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.CheckStreamKeyDTO;
import com.example.livestreaming.payload.PublicChannelDTO;

import java.util.List;


public interface ChannelService {
    public User getAuthorizedUser();
    public Boolean checkStreamKey (String streamKey);
    public String generateStreamKey ();
    public ChannelDTO getChannel ();
    public ChannelDTO updateChannel(ChannelDTO channelDTO);
    public ChannelDTO startLiveStream (CheckStreamKeyDTO checkStreamKeyDTO);
    public ChannelDTO stopLiveStream (CheckStreamKeyDTO checkStreamKeyDTO);
    public List<PublicChannelDTO> getAllLiveChannels();
}
