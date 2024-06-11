package com.example.livestreaming.service.serviceImpl;

import com.example.livestreaming.repository.TokenRepository;
import com.example.livestreaming.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutHandlerImpl implements LogoutHandler {
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        jwt = jwtService.getJwtAccessFromCookie(request);
        if (jwt == null || jwt.isEmpty()) {
            return;
        }
        var storeToken = tokenRepository.findByToken(jwt).orElse(null);
        if(storeToken != null) {
            storeToken.setExpired(true);
            storeToken.setRevoked(true);
            var toDelete = tokenRepository.findAllValidTokenByUser(storeToken.getUser().getId());
            toDelete.forEach(t -> {
                tokenRepository.deleteById(t.getId());
            });
            tokenRepository.save(storeToken);
            response.addHeader("Set-Cookie", "access-token=; Path=/; HttpOnly; Max-Age=0");
        }
    }
}
