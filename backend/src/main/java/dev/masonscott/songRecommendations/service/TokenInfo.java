package dev.masonscott.songRecommendations.service;

public class TokenInfo {
    private String accessToken;
    private String refreshToken;

    public TokenInfo(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}
