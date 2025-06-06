package com.nlp.back.controller.community.like;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.like.request.*;
import com.nlp.back.dto.community.like.response.LikeCountResponse;
import com.nlp.back.dto.community.like.response.LikeStatusResponse;
import com.nlp.back.service.community.like.LikeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 좋아요 관련 REST 컨트롤러 (게시글, 댓글, 대댓글) - DTO 기반 처리
 */
@RestController
@RequestMapping("/api/community/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // ===== 📌 게시글 =====

    @PostMapping("/posts/toggle")
    public ResponseEntity<MessageResponse> togglePostLike(
            @RequestBody PostLikeToggleRequest request,
            HttpServletRequest httpRequest
    ) {
        boolean liked = likeService.togglePostLike(request, httpRequest);
        String message = liked ? "게시글에 좋아요를 눌렀습니다." : "게시글 좋아요를 취소했습니다.";
        return ResponseEntity.ok(MessageResponse.of(message, liked));
    }

    @PostMapping("/posts/count")
    public ResponseEntity<LikeCountResponse> getPostLikeCount(@RequestBody PostLikeCountRequest request) {
        return ResponseEntity.ok(likeService.getPostLikeCount(request));
    }

    @PostMapping("/posts/check")
    public ResponseEntity<LikeStatusResponse> checkPostLike(
            @RequestBody PostLikeStatusRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(likeService.hasLikedPost(request, httpRequest));
    }

    // ===== 💬 댓글 =====

    @PostMapping("/comments/toggle")
    public ResponseEntity<MessageResponse> toggleCommentLike(
            @RequestBody CommentLikeToggleRequest request,
            HttpServletRequest httpRequest
    ) {
        boolean liked = likeService.toggleCommentLike(request, httpRequest);
        String message = liked ? "댓글에 좋아요를 눌렀습니다." : "댓글 좋아요를 취소했습니다.";
        return ResponseEntity.ok(MessageResponse.of(message, liked));
    }

    @PostMapping("/comments/count")
    public ResponseEntity<LikeCountResponse> getCommentLikeCount(@RequestBody CommentLikeCountRequest request) {
        return ResponseEntity.ok(likeService.getCommentLikeCount(request));
    }

    @PostMapping("/comments/check")
    public ResponseEntity<LikeStatusResponse> checkCommentLike(
            @RequestBody CommentLikeStatusRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(likeService.hasLikedComment(request, httpRequest));
    }

    // ===== 🔁 대댓글 =====

    @PostMapping("/replies/toggle")
    public ResponseEntity<MessageResponse> toggleReplyLike(
            @RequestBody ReplyLikeToggleRequest request,
            HttpServletRequest httpRequest
    ) {
        boolean liked = likeService.toggleReplyLike(request, httpRequest);
        String message = liked ? "대댓글에 좋아요를 눌렀습니다." : "대댓글 좋아요를 취소했습니다.";
        return ResponseEntity.ok(MessageResponse.of(message, liked));
    }

    @PostMapping("/replies/count")
    public ResponseEntity<LikeCountResponse> getReplyLikeCount(@RequestBody ReplyLikeCountRequest request) {
        return ResponseEntity.ok(likeService.getReplyLikeCount(request));
    }

    @PostMapping("/replies/check")
    public ResponseEntity<LikeStatusResponse> checkReplyLike(
            @RequestBody ReplyLikeStatusRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(likeService.hasLikedReply(request, httpRequest));
    }
}
