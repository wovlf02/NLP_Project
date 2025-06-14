package com.nlp.back.service.community.emotion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class OpenAiService {

    private final String apiKey;
    private final String model;
    private final WebClient webClient;

    public OpenAiService(
            @Value("${openai.api-key}") String apiKey,
            @Value("${openai.model}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public Map<String, Object> analyzeAndReturn(String content) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "temperature", 0.0,
                "messages", java.util.List.of(
                        Map.of("role", "system", "content", "커뮤니티 가이드라인 위배 여부를 판단해주세요."),
                        Map.of("role", "user", "content", content)
                )
        );

        try {
            Map<String, Object> response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            System.out.println("=== OpenAI API 응답 전체 ===");
            System.out.println(response);

            return response; // 응답 데이터 반환

        } catch (Exception e) {
            System.out.println("API 호출 실패: " + e.getMessage());
            return Map.of("error", e.getMessage()); // 오류 정보 반환
        }
    }
}
