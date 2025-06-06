package com.nlp.back.dto.community.comment.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * 대댓글 수정 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyUpdateRequest {

    @NotNull(message = "replyId는 필수입니다.")
    private Long replyId;

    @NotBlank(message = "수정할 내용을 입력해주세요.")
    private String content;
}
