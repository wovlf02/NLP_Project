package com.nlp.back.dto.dashboard.todo.response;

import com.nlp.back.entity.dashboard.PriorityLevel;
import lombok.Builder;
import lombok.Getter;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

@Getter
@Builder
public class TodoResponse {

    /**
     * Todo ID
     */
    private Long id;

    /**
     * 제목
     */
    private String title;

    /**
     * 설명 (선택)
     */
    private String description;

    /**
     * 날짜
     */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonProperty("date")
    private LocalDate todoDate;

    /**
     * 우선순위 (LOW, NORMAL, HIGH)
     */
    private PriorityLevel priority;

    /**
     * 완료 여부
     */
    private boolean completed;
}
