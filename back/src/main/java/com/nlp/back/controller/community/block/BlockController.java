package com.nlp.back.controller.community.block;

import com.nlp.back.dto.community.block.response.BlockedPostListResponse;
import com.nlp.back.dto.community.block.response.BlockedCommentListResponse;
import com.nlp.back.dto.community.block.response.BlockedReplyListResponse;
import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.service.community.block.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

    // ===== 게시글 =====

    @PostMapping("/posts/{postId}/block")
    public ResponseEntity<MessageResponse> blockPost(@PathVariable Long postId) {
        blockService.blockPost(postId);
        return ResponseEntity.ok(new MessageResponse("해당 게시글을 차단했습니다."));
    }

    @DeleteMapping("/posts/{postId}/block")
    public ResponseEntity<MessageResponse> unblockPost(@PathVariable Long postId) {
        blockService.unblockPost(postId);
        return ResponseEntity.ok(new MessageResponse("해당 게시글의 차단이 해제되었습니다."));
    }

    @GetMapping("/posts/blocked")
    public ResponseEntity<BlockedPostListResponse> getBlockedPosts() {
        return ResponseEntity.ok(blockService.getBlockedPosts());
    }

    // ===== 댓글 =====

    @PostMapping("/comments/{commentId}/block")
    public ResponseEntity<MessageResponse> blockComment(@PathVariable Long commentId) {
        blockService.blockComment(commentId);
        return ResponseEntity.ok(new MessageResponse("해당 댓글을 차단했습니다."));
    }

    @DeleteMapping("/comments/{commentId}/block")
    public ResponseEntity<MessageResponse> unblockComment(@PathVariable Long commentId) {
        blockService.unblockComment(commentId);
        return ResponseEntity.ok(new MessageResponse("해당 댓글의 차단이 해제되었습니다."));
    }

    @GetMapping("/comments/blocked")
    public ResponseEntity<BlockedCommentListResponse> getBlockedComments() {
        return ResponseEntity.ok(blockService.getBlockedComments());
    }

    // ===== 대댓글 =====

    @PostMapping("/replies/{replyId}/block")
    public ResponseEntity<MessageResponse> blockReply(@PathVariable Long replyId) {
        blockService.blockReply(replyId);
        return ResponseEntity.ok(new MessageResponse("해당 대댓글을 차단했습니다."));
    }

    @DeleteMapping("/replies/{replyId}/block")
    public ResponseEntity<MessageResponse> unblockReply(@PathVariable Long replyId) {
        blockService.unblockReply(replyId);
        return ResponseEntity.ok(new MessageResponse("해당 대댓글의 차단이 해제되었습니다."));
    }

    @GetMapping("/replies/blocked")
    public ResponseEntity<BlockedReplyListResponse> getBlockedReplies() {
        return ResponseEntity.ok(blockService.getBlockedReplies());
    }
}
