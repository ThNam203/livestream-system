package com.example.livestreaming.payload;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChannelDTO {
    private Integer id;
    private String streamKey;
    private String channelName;
    private String title;
    private List<String> tags;
    private boolean isLiveStreaming;
    private boolean enableLLHLS;
}
