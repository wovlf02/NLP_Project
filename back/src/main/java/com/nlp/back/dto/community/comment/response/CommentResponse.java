package com.nlp.back.dto.community.comment.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nlp.back.entity.community.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 댓글/대댓글 단일 응답 DTO (Flat 구조)
 */
@Getter
@AllArgsConstructor
@Builder
public class CommentResponse {

    private Long id;

    @JsonProperty("post_id")
    private Long postId;

    @JsonProperty("parent_id")
    private Long parentId;

    private String content;

    @JsonProperty("emotion_score")
    private Double emotionScore;

    private AuthorDto author;

    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .content(comment.getContent())
                .emotionScore(comment.getEmotionScore())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .author(AuthorDto.of(comment.getWriter()))
                .build();
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class AuthorDto {
        private Long id;
        private String name;
        private String profileImageUrl;

        public static AuthorDto of(com.nlp.back.entity.user.User user) {
            return AuthorDto.builder()
                    .id(user.getId())
                    .name(user.getNickname())
                    .profileImageUrl(user.getProfileImageUrl())
                    .build();
        }
    }
}
