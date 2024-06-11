package com.example.livestreaming.mapper;

import com.example.livestreaming.entity.ChatMessage;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.ChatMessageDTO;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.utils.Common;

import java.util.Date;

public class ChatMapper {
    public static ChatMessageDTO toChatMessageDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .roomId(message.getRoomId())
                .sender(message.getSender())
                .message(message.getMessage())
                .time(Common.convertDateToISOString(message.getTime()))
                .type(message.getType())
                .build();
    }

    public static ChatMessage toChatMessage(ChatMessageDTO chatMessageDTO) {
        return ChatMessage.builder()
                .roomId(chatMessageDTO.getRoomId())
                .sender(chatMessageDTO.getSender())
                .message(chatMessageDTO.getMessage())
                .time(new Date(chatMessageDTO.getTime()))
                .type(chatMessageDTO.getType())
                .build();
    }

}
