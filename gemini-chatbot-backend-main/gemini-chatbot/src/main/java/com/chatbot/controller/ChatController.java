package com.chatbot.controller;

import com.chatbot.dto.ChatRequest;
import com.chatbot.dto.ChatResponse;
import com.chatbot.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal OAuth2User principal) {
        String userName = principal != null ? principal.getAttribute("name") : "Anonymous";
        try {
            String response = geminiService.generateResponse(request.getMessage());
            return ResponseEntity.ok(ChatResponse.builder()
                .response(response)
                .userName(userName)
                .timestamp(System.currentTimeMillis())
                .build());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ChatResponse.builder()
                .response("Error processing message: " + ex.getMessage())
                .userName(userName)
                .timestamp(System.currentTimeMillis())
                .build());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "name", principal.getAttribute("name"),
            "email", principal.getAttribute("email"),
            "picture", principal.getAttribute("picture")
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Oh_Mochi_AI Backend"
        ));
    }
}