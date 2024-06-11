package com.example.livestreaming.service.serviceImpl;

import com.example.livestreaming.entity.Token;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.mapper.UserMapper;
import com.example.livestreaming.payload.ChannelDTO;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.repository.ChannelRepository;
import com.example.livestreaming.repository.TokenRepository;
import com.example.livestreaming.repository.UserRepository;
import com.example.livestreaming.service.KeyGenerationService;
import com.example.livestreaming.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final KeyGenerationService keyGenerationService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<String> getToken(Integer id) {
        var tokenList = tokenRepository.findAllValidTokenByUser(id);
        return tokenList.stream().map(Token::getToken).collect(Collectors.toList());
    }

    @Override
    public UserDTO getUser() {
        return UserMapper.toUserDTO(getAuthorizedUser());
    }

    @Override
    public User getAuthorizedUser() {
        var name = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(name).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserDTO updateProfile(UserDTO userDTO) {
        var user = getAuthorizedUser();
        user.setBio(userDTO.getBio());
        user.setBirth(userDTO.getBirth());
        user.setEmail(userDTO.getEmail());
//        user.setUsername(userDTO.getUsername());
        userRepository.save(user);
        return UserMapper.toUserDTO(user);
    }
    @Override
    public String updatePassword(String oldPassword, String newPassword) {
        var user = getAuthorizedUser();
        if(passwordEncoder.matches(passwordEncoder.encode(oldPassword), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return "Password updated successfully";
        }
        throw new RuntimeException("Password is incorrect");
    }
}
