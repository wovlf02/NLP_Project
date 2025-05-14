package com.nlp.back.dto.community.post.request;

import lombok.Data;

/**
 * 게시글 자동 완성 요청 DTO
 * <p>
 * 사용자가 문제 기반으로 자동으로 게시글 내용을 채우고자 할 때 사용됩니다.
 * 예: 문제 풀이 요약 → 게시글 본문 생성
 * </p>
 */
@Data
public class PostAutoFillRequest {

    /**
     * 자동 완성 대상 문제 ID
     */
    private Long problemId;

    /**
     * 요청자 사용자 ID
     */
    private Long userId;

    /**
     * 문제 제목 (자동 완성용 텍스트에 활용)
     */
    private String problemTitle;

    /**
     * 문제 분류 또는 카테고리 (예: 구현, DFS, DP 등)
     */
    private String category;
}
