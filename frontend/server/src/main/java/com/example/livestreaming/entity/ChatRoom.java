package com.example.livestreaming.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatRoom {
    public Integer roomId;
    public String roomName;
    public Integer adminId;
    public String admin;
    public List<Integer> userIds;
    public List<ChatMessage> messages;
    public Date timeStart;
}
