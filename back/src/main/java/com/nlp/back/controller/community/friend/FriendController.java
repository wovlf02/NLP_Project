package com.nlp.back.controller.community.friend;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.friend.request.FriendAcceptRequest;
import com.nlp.back.dto.community.friend.request.FriendRejectRequest;
import com.nlp.back.dto.community.friend.request.FriendRequestSendRequest;
import com.nlp.back.dto.community.friend.response.FriendListResponse;
import com.nlp.back.dto.community.friend.response.FriendRequestListResponse;
import com.nlp.back.dto.community.friend.response.FriendSearchResponse;
import com.nlp.back.dto.community.friend.response.BlockedFriendListResponse;
import com.nlp.back.service.community.friend.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 친구 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    /**
     * 친구 요청 전송
     */
    @PostMapping("/request")
    public ResponseEntity<MessageResponse> sendFriendRequest(@RequestBody FriendRequestSendRequest request) {
        friendService.sendFriendRequest(request);
        return ResponseEntity.ok(new MessageResponse("친구 요청이 전송되었습니다."));
    }

    /**
     * 친구 요청 수락
     */
    @PostMapping("/request/{requestId}/accept")
    public ResponseEntity<MessageResponse> acceptFriendRequest(@RequestBody FriendAcceptRequest request) {
        friendService.acceptFriendRequest(request);
        return ResponseEntity.ok(new MessageResponse("친구 요청을 수락했습니다."));
    }

    /**
     * 친구 요청 거절
     */
    @PostMapping("/request/{requestId}/reject")
    public ResponseEntity<MessageResponse> rejectFriendRequest(@RequestBody FriendRejectRequest request) {
        friendService.rejectFriendRequest(request);
        return ResponseEntity.ok(new MessageResponse("친구 요청을 거절했습니다."));
    }

    /**
     * 친구 목록 조회
     */
    @GetMapping
    public ResponseEntity<FriendListResponse> getFriendList() {
        return ResponseEntity.ok(friendService.getFriendList());
    }

    /**
     * 받은 친구 요청 목록 조회
     */
    @GetMapping("/requests")
    public ResponseEntity<FriendRequestListResponse> getReceivedRequests() {
        return ResponseEntity.ok(friendService.getReceivedFriendRequests());
    }

    /**
     * 닉네임으로 사용자 검색
     */
    @GetMapping("/search")
    public ResponseEntity<FriendSearchResponse> searchUsersByNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(friendService.searchUsersByNickname(nickname));
    }

    /**
     * 친구 삭제
     */
    @DeleteMapping("/{friendId}")
    public ResponseEntity<MessageResponse> deleteFriend(@PathVariable Long friendId) {
        friendService.deleteFriend(friendId);
        return ResponseEntity.ok(new MessageResponse("친구가 삭제되었습니다."));
    }

    /**
     * 사용자 차단
     */
    @PostMapping("/block/{userId}")
    public ResponseEntity<MessageResponse> blockUser(@PathVariable Long userId) {
        friendService.blockUser(userId);
        return ResponseEntity.ok(new MessageResponse("해당 사용자를 차단하였습니다."));
    }

    /**
     * 사용자 차단 해제
     */
    @DeleteMapping("/block/{userId}")
    public ResponseEntity<MessageResponse> unblockUser(@PathVariable Long userId) {
        friendService.unblockUser(userId);
        return ResponseEntity.ok(new MessageResponse("차단을 해제하였습니다."));
    }

    /**
     * 차단한 사용자 목록 조회
     */
    @GetMapping("/blocked")
    public ResponseEntity<BlockedFriendListResponse> getBlockedUsers() {
        return ResponseEntity.ok(friendService.getBlockedUsers());
    }
}
