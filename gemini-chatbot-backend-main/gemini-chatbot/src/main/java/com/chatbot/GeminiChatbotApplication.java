package com.chatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GeminiChatbotApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeminiChatbotApplication.class, args);
    }

    // I DELETED THE corsConfigurer METHOD FROM HERE
    // because we are handling it in SecurityConfig.java now.
}