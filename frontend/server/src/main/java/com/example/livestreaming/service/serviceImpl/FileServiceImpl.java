package com.example.livestreaming.service.serviceImpl;

import com.example.livestreaming.entity.File;
import com.example.livestreaming.entity.Token;
import com.example.livestreaming.entity.User;
import com.example.livestreaming.repository.FileRepository;
import com.example.livestreaming.repository.TokenRepository;
import com.example.livestreaming.repository.UserRepository;
import com.example.livestreaming.service.FileService;
import com.example.livestreaming.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private final FileRepository fileRepository;

    @Override
    public List<File> getFile(File file) {
        return null;
    }
}
