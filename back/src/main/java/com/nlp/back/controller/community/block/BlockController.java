package com.nlp.back.controller.community.block;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.block.request.BlockTargetRequest;
import com.nlp.back.dto.community.block.request.UnblockTargetRequest;
import com.nlp.back.dto.community.block.response.BlockedUserListResponse;
import com.nlp.back.service.community.block.BlockService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 차단 및 해제 기능 컨트롤러
 * FriendsPage.js와 연동되는 API
 */
@RestController
@RequestMapping("/api/blocks/users")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

    /**
     * 👤 사용자 차단
     * POST /api/blocks/users
     */
    @PostMapping
    public ResponseEntity<MessageResponse> blockUser(
            @RequestBody BlockTargetRequest request,
            HttpServletRequest httpRequest
    ) {
        blockService.blockUser(request, httpRequest);
        return ok("🚫 사용자를 차단했습니다.");
    }

    /**
     * 🔓 사용자 차단 해제
     * DELETE /api/blocks/users
     */
    @DeleteMapping
    public ResponseEntity<MessageResponse> unblockUser(
            @RequestBody UnblockTargetRequest request,
            HttpServletRequest httpRequest
    ) {
        blockService.unblockUser(request, httpRequest);
        return ok("🔓 사용자 차단을 해제했습니다.");
    }

    /**
     * 📋 차단한 사용자 목록 조회
     * GET /api/blocks/users
     */
    @GetMapping
    public ResponseEntity<BlockedUserListResponse> getBlockedUsers(
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(blockService.getBlockedUsers(httpRequest));
    }

    /**
     * ✅ 공통 메시지 응답 포맷
     */
    private ResponseEntity<MessageResponse> ok(String msg) {
        return ResponseEntity.ok(MessageResponse.of(msg));
    }
}
