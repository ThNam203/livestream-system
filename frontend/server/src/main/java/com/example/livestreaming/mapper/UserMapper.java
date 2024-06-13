package com.example.livestreaming.mapper;

import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.UserDTO;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
public class UserMapper {
    public static UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .bio(user.getBio() == null ? "" : user.getBio())
                .birth(user.getBirth())
                .email(user.getEmail())
                .build();
    }

    public static User toUser(UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .bio(userDTO.getBio())
                .birth(userDTO.getBirth())
                .email(userDTO.getEmail())
                .build();
    }
}
