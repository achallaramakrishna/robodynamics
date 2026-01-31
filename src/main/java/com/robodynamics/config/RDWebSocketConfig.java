package com.robodynamics.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class RDWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint URL:  /robodynamics/ws-chat  (in prod, contextPath is added by Tomcat)
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // tighten later
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // client -> server messages start with /app
        registry.setApplicationDestinationPrefixes("/app");

        // server -> client messages go to /topic (and /queue if needed)
        registry.enableSimpleBroker("/topic", "/queue");
    }
}
