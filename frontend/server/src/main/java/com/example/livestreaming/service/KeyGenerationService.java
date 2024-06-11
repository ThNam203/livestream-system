package com.example.livestreaming.service;

import com.example.livestreaming.entity.User;
import com.example.livestreaming.payload.UserDTO;

import java.util.List;

public interface KeyGenerationService {
    public String generateKey(int length);
    public String generateStreamKey ();
}
