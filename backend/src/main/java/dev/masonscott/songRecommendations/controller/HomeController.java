package dev.masonscott.songRecommendations.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

//    @Autowired
//    private OAuth2AuthorizedClientService authorizedClientService;

    @GetMapping("/")
    public String home() {
        return "Hello Home!";
    }

//    @GetMapping("/api/user/stats")
//    public ResponseEntity<Object> getUserStats(@AuthenticationPrincipal OAuth2User principal) {
//        if (principal == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
//        }
//
//        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
//                "spotify",
//                principal.getName()
//        );
//
//        if (authorizedClient == null) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No authorized client found");
//        }
//
//        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
//        String userId = (String) principal.getAttribute("id");
//        String url = "http://0.0.0.0:5000/get-stats/" + userId;
//
//        RestTemplate restTemplate = new RestTemplate();
//
//        try {
//            Map<String, Object> fastAPIResponse = restTemplate.getForObject(url, Map.class);
//            return ResponseEntity.ok(fastAPIResponse);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error calling rec engine: " + e.getMessage());
//        }
//    }
}
