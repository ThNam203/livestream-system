package com.example.livestreaming.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PublicChannelDTO {
    private Integer id;
    private String channelName;
    private String title;
    private List<String> tags;
    private boolean isLiveStreaming;
}
