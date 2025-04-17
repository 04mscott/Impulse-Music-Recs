package dev.masonscott.songRecommendations.controller;

import dev.masonscott.songRecommendations.service.TokenInfo;
import dev.masonscott.songRecommendations.service.TokenStore;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class SpotifyAuthController {

    private static final String REDIRECT_URI = "http://127.0.0.1:8080/auth/callback";

    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;


    private final TokenStore tokenStore;

    public SpotifyAuthController(TokenStore tokenStore) {
        this.tokenStore = tokenStore;
    }

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(@RequestParam("user_id") String userId) {
        TokenInfo tokenInfo = tokenStore.getTokens(userId);
        if (tokenInfo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(Map.of("access_token", tokenInfo.getAccessToken()));
    }

    @GetMapping("/login")
    public void login(HttpServletResponse response) throws IOException {
        String state = UUID.randomUUID().toString();

        String scope = "streaming user-read-playback-state user-modify-playback-state " +
                "user-read-email user-library-read user-top-read user-library-modify " +
                "playlist-read-private playlist-read-collaborative user-read-private user-follow-read";

        String scopeEncoded = URLEncoder.encode(scope, StandardCharsets.UTF_8);

        String query = "https://accounts.spotify.com/authorize?" +
                "response_type=code" +
                "&client_id=" + clientId +
                "&scope=" + scopeEncoded +
                "&redirect_uri=" + REDIRECT_URI +
                "&state=" + state;

        response.sendRedirect(query);
    }

    @GetMapping("/callback")
    public void callback(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) throws IOException {

        String authHeader = Base64.getEncoder()
                .encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + authHeader);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", REDIRECT_URI);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                    "https://accounts.spotify.com/api/token", request, Map.class);

            if (tokenResponse.getStatusCode().is2xxSuccessful() && tokenResponse.getBody() != null) {
                Map<String, Object> tokens = tokenResponse.getBody();

                String accessToken = tokens.get("access_token").toString();
//                String refreshToken = tokens.get("refresh_token").toString();

                HttpHeaders userHeaders = new HttpHeaders();
                userHeaders.setBearerAuth(accessToken);
                HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

                ResponseEntity<Map> userResponse = restTemplate.exchange(
                        "https://api.spotify.com/v1/me",
                        HttpMethod.GET,
                        userRequest,
                        Map.class
                );

                String userId = userResponse.getBody().get("id").toString();

                tokenStore.storeTokens(userId, accessToken, "");
                System.out.println("Stored token for user: " + userId);

                String redirect = String.format(
                        "http://localhost:3000/?access_token=%s&user_id=%s",
                        URLEncoder.encode(accessToken, "UTF-8"),
                        URLEncoder.encode(userId, "UTF-8")
                );
                response.sendRedirect(redirect);


            } else {
                response.sendRedirect("http://localhost:3000/?error=token_request_failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/?error=exception_during_callback");
        }
    }

    @GetMapping("/test-cookie")
    public void testCookie(HttpServletResponse response) throws IOException {
        response.setHeader("Set-Cookie",
                "spotify_test=value123; Max-Age=3600; Path=/; Domain=localhost; HttpOnly; SameSite=None; Secure");

        response.sendRedirect("http://localhost:3000");
    }



}
