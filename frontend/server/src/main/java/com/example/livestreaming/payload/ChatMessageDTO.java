package com.example.livestreaming.payload;

import com.example.livestreaming.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessageDTO {
    public Integer roomId;
    public String sender;
    public String message;
    public String time;
    public MessageType type;
}
