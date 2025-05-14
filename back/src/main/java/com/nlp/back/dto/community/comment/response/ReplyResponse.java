package com.nlp.back.dto.community.comment.response;

import com.nlp.back.entity.community.Reply;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 대댓글 응답 DTO
 */
@Data
@AllArgsConstructor
public class ReplyResponse {

    /**
     * 대댓글 ID
     */
    private Long replyId;

    /**
     * 작성자 ID
     */
    private Long writerId;

    /**
     * 작성자 닉네임
     */
    private String writerNickname;

    /**
     * 프로필 이미지 URL
     */
    private String profileImageUrl;

    /**
     * 대댓글 내용
     */
    private String content;

    /**
     * 작성 시각
     */
    private LocalDateTime createdAt;

    /**
     * 수정 시각
     */
    private LocalDateTime updatedAt;

    /**
     * 좋아요 수
     */
    private int likeCount;

    /**
     * 내가 좋아요 눌렀는지 여부
     */
    private boolean liked;

    /**
     * Reply 엔티티를 ReplyResponse DTO로 변환
     *
     * @param reply Reply 엔티티
     * @return ReplyResponse DTO
     */
    public static ReplyResponse from(Reply reply, Long currentUserId) {
        boolean liked = reply.getLikes() != null &&
                reply.getLikes().stream()
                        .anyMatch(like -> like.getUser().getId().equals(currentUserId));

        return new ReplyResponse(
                reply.getId(),
                reply.getWriter().getId(),
                reply.getWriter().getNickname(), // ✅ 닉네임 필드 사용
                reply.getWriter().getProfileImageUrl(),
                reply.getContent(),
                reply.getCreatedAt(),
                reply.getUpdatedAt(),
                reply.getLikes() != null ? reply.getLikes().size() : 0,
                liked
        );
    }

}
