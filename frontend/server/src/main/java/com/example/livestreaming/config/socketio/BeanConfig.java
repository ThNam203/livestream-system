package com.example.livestreaming.config.socketio;

import com.example.livestreaming.entity.ChatMessage;
import com.example.livestreaming.entity.ChatRoom;
import com.example.livestreaming.enums.MessageType;
import com.example.livestreaming.mapper.ChatMapper;
import com.example.livestreaming.payload.ChatMessageDTO;
import com.example.livestreaming.payload.JoinRoomRequestDTO;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.utils.Common;
import com.example.livestreaming.utils.Json;
import io.socket.engineio.server.EngineIoServer;
import io.socket.engineio.server.EngineIoServerOptions;
import io.socket.socketio.server.SocketIoServer;
import io.socket.socketio.server.SocketIoSocket;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Configuration
public class BeanConfig {

    @Bean
    EngineIoServer engineIoServer() {
        var opt = EngineIoServerOptions.newFromDefault();
        opt.setCorsHandlingDisabled(true);
        var eioServer = new EngineIoServer(opt);
        return eioServer;
    }

    @Bean
    SocketIoServer socketIoServer(EngineIoServer eioServer) {
        var sioServer = new SocketIoServer(eioServer);
        var namespace = sioServer.namespace("/chat");
        HashMap<String, UserDTO> hmSocketUser = new HashMap<>();
        HashMap<String, Integer> hmSocketRoom = new HashMap<>();
        List<ChatRoom> chatRooms = new ArrayList<>();

        namespace.on("connection", args -> {
            var socket = (SocketIoSocket) args[0];

            socket.on("join", args1 -> {
                //get data from request
                JSONObject o = (JSONObject) args1[0];
                JoinRoomRequestDTO req = Json.toPojoObj(o, JoinRoomRequestDTO.class);

                //check if room exists
                if (chatRooms.stream().filter(room -> room.roomId.equals(req.roomId)).collect(Collectors.toList()).isEmpty()) {
                    //room does not exist -> create room

                    //store new room
                    ChatRoom newRoom = ChatRoom.builder().roomId(req.roomId).roomName(req.roomName).adminId(req.senderId).admin(req.sender).userIds(List.of(req.senderId)).timeStart(new Date()).build();
                    chatRooms.add(newRoom);

                    //store user and room data by socketId
                    hmSocketUser.put(socket.getId(), UserDTO.builder().id(req.senderId).username(req.sender).build());
                    hmSocketRoom.put(socket.getId(), newRoom.roomId);

                    //send the time this room was created
                    socket.send("timeStart", Json.toJsonObj(ChatMapper.toChatMessageDTO(ChatMessage.builder().roomId(req.roomId).sender("server").time(newRoom.timeStart).message("This is the time created").type(MessageType.JOIN).build())));

                    //join socket to room and send first message
                    socket.joinRoom(req.roomId.toString());
                    socket.send("message", Json.toJsonObj(ChatMapper.toChatMessageDTO(ChatMessage.builder().roomId(req.roomId).sender("server").time(new Date()).message("You created the chat room.").type(MessageType.JOIN).build())));
                    ChatMessage firstMessage = ChatMessage.builder().roomId(req.roomId).sender("server").time(new Date()).message(req.sender + " created the chat room.").type(MessageType.JOIN).build();
                    saveMessage(chatRooms, req.roomId, firstMessage);
                }
                else
                {
                    //room exists -> join room

                    //store user and room data by socketId
                    hmSocketUser.put(socket.getId(), UserDTO.builder().id(req.senderId).username(req.sender).build());
                    hmSocketRoom.put(socket.getId(), req.roomId);

                    //add userId to room, get old messages and get time start
                    List<ChatMessage> oldMessages = new ArrayList<>();
                    Date timeStart = new Date();
                    chatRooms.forEach(room -> {
                        if (room.roomId.equals(req.roomId)) {
                            List<Integer> newUserIdList = new ArrayList<>(room.getUserIds() == null ? List.of() : room.getUserIds());
                            newUserIdList.add(req.senderId);
                            room.setUserIds(newUserIdList);

                            //get old messages
                            oldMessages.addAll(room.getMessages() == null ? List.of() : room.getMessages());

                            //get time start
                            timeStart.setTime(room.getTimeStart().getTime());
                        }
                    });

                    //send old messages to user
                    JSONArray jsonArray = new JSONArray();
                    oldMessages.forEach(message -> jsonArray.put(Json.toJsonObj(message)));
                    socket.send("messages", jsonArray);

                    //send the time this room was created
                    socket.send("timeStart", Json.toJsonObj(ChatMapper.toChatMessageDTO(ChatMessage.builder().roomId(req.roomId).sender("server").time(timeStart).message("This is the time created").type(MessageType.JOIN).build())));

                    //join socket to room and send message to others when new user joined
                    socket.send("message", Json.toJsonObj(ChatMapper.toChatMessageDTO(ChatMessage.builder().roomId(req.roomId).sender("server").time(new Date()).message("You joined the chat room.").type(MessageType.JOIN).build())));
                    socket.joinRoom(req.roomId.toString());
                    ChatMessage message = ChatMessage.builder().roomId(req.roomId).sender("server").time(new Date()).message(req.sender + " joined the chat room.").type(MessageType.JOIN).build();
                    socket.broadcast(req.roomId.toString(),"message", Json.toJsonObj(ChatMapper.toChatMessageDTO(message)));
                    saveMessage(chatRooms,req.roomId,message);

                }
            });

            socket.on("disconnect", args1 -> {
                Integer userId = hmSocketUser.get(socket.getId()).getId();
                String username = hmSocketUser.get(socket.getId()).getUsername();
                Integer roomId = hmSocketRoom.get(socket.getId());

                //remove user from room
                chatRooms.forEach(room -> {
                    Boolean shouldRemoveRoom = false;
                    if (room.roomId.equals(roomId)) {
                        List<Integer> newUserIdList = new ArrayList<>(room.getUserIds() == null ? List.of() : room.getUserIds());
                        newUserIdList.remove(userId);
                        room.setUserIds(newUserIdList);
                        if (!newUserIdList.contains(room.adminId)) {
                            shouldRemoveRoom = true;
                        }
                    }

                    if(shouldRemoveRoom) {
                        socket.broadcast(roomId.toString(),"disconnect");
                        chatRooms.remove(room);
                    }
                });
                socket.broadcast(roomId.toString(),"message", Json.toJsonObj(ChatMapper.toChatMessageDTO(ChatMessage.builder().roomId(roomId).sender("server").time(new Date()).message(username + " left the chat room.").type(MessageType.LEAVE).build())));
            });

            socket.on("message", args1 -> {
                //get data from request
                JSONObject o = (JSONObject) args1[0];
                ChatMessage chatMessage = Json.toPojoObj(o, ChatMessage.class);
                chatMessage.setTime(new Date()); // use the time of server
                Integer roomId = hmSocketRoom.get(socket.getId());

                //save message to room
                saveMessage(chatRooms, roomId, chatMessage);
                socket.broadcast(chatMessage.roomId.toString(),"message", Json.toJsonObj(ChatMapper.toChatMessageDTO(chatMessage)));
            });
        });

        return sioServer;
    }

    public void saveMessage(List<ChatRoom> chatRooms, Integer roomId, ChatMessage chatMessage) {
        chatRooms.stream().forEach(room -> {
            if (room.roomId.equals(roomId)) {
                try{
                    List<ChatMessage> newMessages = new ArrayList<>(room.getMessages() == null ? List.of() : room.getMessages());
                    newMessages.add(chatMessage);
                    room.setMessages(newMessages);
                }
                catch (Exception e) {
                    System.out.println("Error: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        });
    }
}
