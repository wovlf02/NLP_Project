package com.nlp.back.controller.emotion;

import com.nlp.back.service.community.emotion.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emotion")
@RequiredArgsConstructor
public class EmotionController {

    private final OpenAiService openAiService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeEmotion(@RequestBody String text) {
        try {
            System.out.println("감정 분석 요청 수신: " + text);

            Map<String, Object> result = openAiService.analyzeAndReturn(text);
            System.out.println("감정 분석 결과: " + result);

            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            System.out.println("감정 분석 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "감정 분석 중 오류가 발생했습니다."));
        }
    }
}
