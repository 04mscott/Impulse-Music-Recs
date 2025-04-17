package dev.masonscott.songRecommendations.service;

import dev.masonscott.songRecommendations.controller.SpotifyAuthController;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenStore {

    private final Map<String, TokenInfo> userTokens = new ConcurrentHashMap<>();

    public void storeTokens(String userId, String accessToken, String refreshToken) {
        userTokens.put(userId, new TokenInfo(accessToken, refreshToken));
    }

    public TokenInfo getTokens(String userId) {
        return userTokens.get(userId);
    }
}
