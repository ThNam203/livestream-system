package com.example.livestreaming.auth;

import com.example.livestreaming.entity.Channel;
import com.example.livestreaming.entity.Token;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.enums.Role;
import com.example.livestreaming.enums.TokenType;
import com.example.livestreaming.mapper.UserMapper;
import com.example.livestreaming.payload.LoginDTO;
import com.example.livestreaming.payload.RegisterDTO;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.repository.ChannelRepository;
import com.example.livestreaming.repository.TokenRepository;
import com.example.livestreaming.repository.UserRepository;
import com.example.livestreaming.service.JwtService;
import com.example.livestreaming.service.KeyGenerationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final KeyGenerationService keyGenerationService;

    public UserDTO register (RegisterDTO request, HttpServletResponse response) {
        try {
            var channel = Channel.builder()
                    .streamKey(keyGenerationService.generateStreamKey())
                    .channelName(request.getUsername())
                    .title("")
                    .tags(List.of())
                    .build();
            channelRepository.save(channel);
            var newChannel = channelRepository.findByChannelName(channel.getChannelName()).orElseThrow(() -> new RuntimeException("Failed to create channel"));

            var user = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .birth(request.getBirth())
                    .email(request.getEmail())
                    .role(Role.USER)
                    .channel(newChannel)
                    .build();

            userRepository.save(user);

            var jwt = jwtService.generateToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwt);
            ResponseCookie cookie = jwtService.generateCookie(jwt);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return UserMapper.toUserDTO(user);
        }
        catch (Exception e) {
            throw new RuntimeException("Username already exists");
        }
    }

    public UserDTO authenticate (LoginDTO request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        var jwt = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwt);
        ResponseCookie cookie = jwtService.generateCookie(jwt);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return UserMapper.toUserDTO(user);
    }

    private void saveUserToken(User user, String jwt) {
        var token = Token.builder()
                .user(user)
                .token(jwt)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens (User user) {
        var validTokenList = tokenRepository.findAllValidTokenByUser(user.getId());
        if(validTokenList.isEmpty()) return;
        validTokenList.forEach(t -> {
            t.setRevoked(true);
            t.setExpired(true);
        });
        tokenRepository.saveAll(validTokenList);
    }
}
