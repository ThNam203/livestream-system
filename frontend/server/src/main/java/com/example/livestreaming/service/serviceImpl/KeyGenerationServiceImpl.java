package com.example.livestreaming.service.serviceImpl;

import com.example.livestreaming.entity.Token;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.mapper.UserMapper;
import com.example.livestreaming.payload.UserDTO;
import com.example.livestreaming.repository.TokenRepository;
import com.example.livestreaming.repository.UserRepository;
import com.example.livestreaming.service.KeyGenerationService;
import com.example.livestreaming.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeyGenerationServiceImpl implements KeyGenerationService {
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom secureRandom = new SecureRandom();

    private static final String PREFIX = "live_";
    private static final int RANDOM_STRING_LENGTH = 20;

    @Override
    public String generateKey(int length) {
        StringBuilder stringBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = secureRandom.nextInt(ALPHANUMERIC.length());
            stringBuilder.append(ALPHANUMERIC.charAt(index));
        }
        return stringBuilder.toString();
    }

    @Override
    public String generateStreamKey() {
        //Create a new stream key
        long timestamp = Instant.now().getEpochSecond();
        String randomString = generateKey(RANDOM_STRING_LENGTH);
        return PREFIX + timestamp + "_" + randomString;
    }
}
