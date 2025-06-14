package com.nlp.back.dto.dashboard.todo.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * 할 일 삭제 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoDeleteRequest {

    @NotNull
    @JsonProperty("todoId")
    private Long todoId;
}
