package dev.masonscott.songRecommendations.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public HomeController(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    @GetMapping("/")
    public String home() {
        return "Hello Home!";
    }


    @GetMapping("/api/spotify/token")
    public ResponseEntity<Map<String, Object>> getSpotifyToken(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> response = new HashMap<>();
        if (principal == null) {
            response.put("error", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                "spotify",
                principal.getName()
        );

        if (authorizedClient == null) {
            response.put("error", "No authorized client found.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();

        response.put("access_token", accessToken.getTokenValue());
        response.put("expires_at", accessToken.getExpiresAt());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/user/stats")
    public ResponseEntity<Object> getUserStats(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                "spotify",
                principal.getName()
        );

        if (authorizedClient == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No authorized client found");
        }
        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        String userId = (String) principal.getAttribute("id");
        String url = "http://0.0.0.0:5000/get-stats/" + userId;

        RestTemplate restTemplate = new RestTemplate();

        try {
            Map<String, Object> fastAPIResponse = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(fastAPIResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error calling rec engine: " + e.getMessage());
        }
    }
}
