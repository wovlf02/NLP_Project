package com.nlp.back.controller.community.friend;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.friend.request.*;
import com.nlp.back.dto.community.friend.response.*;
import com.nlp.back.service.community.friend.FriendService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @PostMapping(value = "/request", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> sendFriendRequest(
            @RequestBody FriendRequestSendRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.sendFriendRequest(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("친구 요청이 전송되었습니다."));
    }

    @PostMapping(value = "/request/accept", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> acceptFriendRequest(
            @RequestBody FriendAcceptRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.acceptFriendRequest(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("친구 요청을 수락했습니다."));
    }

    @PostMapping(value = "/request/reject", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> rejectFriendRequest(
            @RequestBody FriendRejectRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.rejectFriendRequest(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("친구 요청을 거절했습니다."));
    }

    @PostMapping(value = "/request/cancel", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> cancelSentFriendRequest(
            @RequestBody FriendCancelRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.cancelSentFriendRequest(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("친구 요청을 취소했습니다."));
    }

    @GetMapping("/requests")
    public ResponseEntity<FriendRequestListResponse> getReceivedRequests(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(friendService.getReceivedFriendRequests(httpRequest));
    }

    @PostMapping(value = "/requests/sent", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SentFriendRequestListResponse> getSentRequests(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(friendService.getSentFriendRequests(httpRequest));
    }

    @GetMapping("/list")
    public ResponseEntity<FriendListResponse> getFriendList(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(friendService.getOnlineOfflineFriendList(httpRequest));
    }

    @PostMapping(value = "/delete", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> deleteFriend(
            @RequestBody FriendDeleteRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.deleteFriend(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("친구가 삭제되었습니다."));
    }

    @PostMapping(value = "/block", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> blockUser(
            @RequestBody FriendBlockRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.blockUser(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("해당 사용자를 차단하였습니다."));
    }

    @PostMapping(value = "/unblock", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> unblockUser(
            @RequestBody FriendBlockRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.unblockUser(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("차단을 해제하였습니다."));
    }

    @GetMapping("/blocked")
    public ResponseEntity<BlockedFriendListResponse> getBlockedUsers(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(friendService.getBlockedUsers(httpRequest));
    }

    @PostMapping(value = "/search", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FriendSearchResponse> searchUsersByNickname(
            @RequestBody FriendSearchRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(friendService.searchUsersByNickname(request, httpRequest));
    }

    @PostMapping(value = "/report", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> reportUser(
            @RequestBody FriendReportRequest request,
            HttpServletRequest httpRequest
    ) {
        friendService.reportUser(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("해당 사용자가 신고되었습니다."));
    }
}
