package com.nlp.back.dto.community.like.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 대댓글 좋아요 토글 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReplyLikeToggleRequest {
    private Long replyId;
}