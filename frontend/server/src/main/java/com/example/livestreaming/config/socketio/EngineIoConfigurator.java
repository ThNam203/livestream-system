package com.example.livestreaming.config.socketio;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class EngineIoConfigurator implements WebSocketConfigurer {

    private final EngineIoHandler mEngineIoHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(mEngineIoHandler, "/socket.io/")
                .addInterceptors(mEngineIoHandler)
                .setAllowedOrigins("*");
    }
}
