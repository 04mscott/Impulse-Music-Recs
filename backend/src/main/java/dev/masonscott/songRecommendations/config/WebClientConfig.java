package dev.masonscott.songRecommendations.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(OAuth2AuthorizedClientManager authorizedClientManager) {
        return WebClient.builder()
                .filter(tokenRefreshFilter(authorizedClientManager))
                .build();
    }

    private ExchangeFilterFunction tokenRefreshFilter(OAuth2AuthorizedClientManager authorizedClientManager) {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            if (clientResponse.statusCode() == HttpStatus.FORBIDDEN) {
                // Read the response body as a String (note: you might need to handle the fact that the body can only be read once)
                return clientResponse.bodyToMono(String.class)
                        .flatMap(body -> {
                            if (body.contains("Invalid API access token")) {
                                // Token appears to be expired/invalid; attempt to refresh it.
                                return refreshTokenAndRetry(authorizedClientManager);
                            }
                            // If the error is something else, return the response as is.
                            return Mono.just(clientResponse);
                        });
            }
            return Mono.just(clientResponse);
        });
    }

    private Mono<ClientResponse> refreshTokenAndRetry(OAuth2AuthorizedClientManager authorizedClientManager) {
        // Build an OAuth2AuthorizeRequest for the client.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                .withClientRegistrationId("spotify")
                .principal(authentication)
                .build();

        // Refresh the token
        OAuth2AuthorizedClient authorizedClient = authorizedClientManager.authorize(authorizeRequest);

        if (authorizedClient != null) {
            // At this point, the authorizedClient contains the new access token.
            // How you proceed depends on your design. Typically, you’d update your client’s token store.
            // You might also want to retry the original request. That retry logic can be handled by your WebClient call chain.
            // For simplicity, here we just complete the Mono without retrying automatically.
            return Mono.error(new RuntimeException("Token refreshed. Please retry your request."));
        } else {
            return Mono.error(new RuntimeException("Could not refresh token; reauthentication required."));
        }
    }
}
