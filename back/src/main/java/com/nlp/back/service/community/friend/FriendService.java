package com.nlp.back.service.community.friend;

import com.nlp.back.dto.community.friend.request.FriendAcceptRequest;
import com.nlp.back.dto.community.friend.request.FriendRejectRequest;
import com.nlp.back.dto.community.friend.request.FriendRequestSendRequest;
import com.nlp.back.dto.community.friend.response.BlockedFriendListResponse;
import com.nlp.back.dto.community.friend.response.FriendListResponse;
import com.nlp.back.dto.community.friend.response.FriendRequestListResponse;
import com.nlp.back.dto.community.friend.response.FriendSearchResponse;
import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.friend.Friend;
import com.nlp.back.entity.friend.FriendBlock;
import com.nlp.back.entity.friend.FriendRequest;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.repository.auth.UserRepository;
import com.nlp.back.repository.friend.FriendBlockRepository;
import com.nlp.back.repository.friend.FriendRepository;
import com.nlp.back.repository.friend.FriendRequestRepository;
import com.nlp.back.security.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 친구 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FriendBlockRepository friendBlockRepository;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new CustomException("로그인 정보가 없습니다.");

        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUserId();
        }

        throw new CustomException("사용자 정보를 불러올 수 없습니다.");
    }

    private User getCurrentUser() {
        return userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new CustomException("사용자 정보를 불러올 수 없습니다."));
    }

    /**
     * 친구 요청 전송
     */
    public void sendFriendRequest(FriendRequestSendRequest request) {
        User sender = getCurrentUser();
        User receiver = userRepository.findById(request.getTargetUserId())
                .orElseThrow(() -> new IllegalArgumentException("대상 사용자가 존재하지 않습니다."));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("자기 자신에게 친구 요청을 보낼 수 없습니다.");
        }

        if (friendRepository.existsByUserAndFriend(sender, receiver) ||
                friendRepository.existsByUserAndFriend(receiver, sender)) {
            throw new IllegalStateException("이미 친구 관계입니다.");
        }

        if (friendRequestRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new IllegalStateException("이미 친구 요청을 보냈습니다.");
        }

        friendRequestRepository.save(FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .build());
    }

    /**
     * 친구 요청 수락
     */
    public void acceptFriendRequest(FriendAcceptRequest request) {
        User receiver = getCurrentUser();
        User sender = userRepository.findById(request.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자가 존재하지 않습니다."));

        FriendRequest friendRequest = friendRequestRepository
                .findBySenderAndReceiver(sender, receiver)
                .orElseThrow(() -> new IllegalArgumentException("친구 요청이 존재하지 않습니다."));

        friendRepository.save(Friend.builder().user(sender).friend(receiver).build());
        friendRepository.save(Friend.builder().user(receiver).friend(sender).build());
        friendRequestRepository.delete(friendRequest);
    }

    /**
     * 친구 요청 거절
     */
    public void rejectFriendRequest(FriendRejectRequest request) {
        User receiver = getCurrentUser();
        User sender = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자가 존재하지 않습니다."));

        FriendRequest friendRequest = friendRequestRepository
                .findBySenderAndReceiver(sender, receiver)
                .orElseThrow(() -> new IllegalArgumentException("친구 요청이 존재하지 않습니다."));

        friendRequestRepository.delete(friendRequest);
    }

    /**
     * 친구 목록 조회
     */
    public FriendListResponse getFriendList() {
        User me = getCurrentUser();
        List<Friend> friends = friendRepository.findAllFriendsOfUser(me);

        return new FriendListResponse(
                friends.stream()
                        .map(f -> f.getUser().equals(me) ? f.getFriend() : f.getUser())
                        .distinct()
                        .map(FriendListResponse.FriendDto::from)
                        .collect(Collectors.toList())
        );
    }

    /**
     * 받은 친구 요청 목록 조회
     */
    public FriendRequestListResponse getReceivedFriendRequests() {
        User me = getCurrentUser();
        List<FriendRequest> requests = friendRequestRepository.findByReceiver(me);
        return new FriendRequestListResponse(
                requests.stream()
                        .map(FriendRequestListResponse.FriendRequestDto::from)
                        .collect(Collectors.toList())
        );
    }

    /**
     * 사용자 닉네임으로 검색
     */
    public FriendSearchResponse searchUsersByNickname(String nickname) {
        User me = getCurrentUser();
        List<User> users = userRepository.findByNicknameContaining(nickname);
        return new FriendSearchResponse(
                users.stream()
                        .filter(user -> !user.getId().equals(me.getId())) // 자기 자신은 제외
                        .map(user -> {
                            boolean alreadyFriend = friendRepository.existsByUserAndFriend(me, user)
                                    || friendRepository.existsByUserAndFriend(user, me); // 양방향 확인
                            boolean alreadyRequested = friendRequestRepository.existsBySenderAndReceiver(me, user);

                            return new FriendSearchResponse.UserSearchResult(
                                    user.getId(),
                                    user.getNickname(),
                                    user.getProfileImageUrl(),
                                    alreadyFriend,
                                    alreadyRequested
                            );
                        })
                        .collect(Collectors.toList())
        );
    }

    /**
     * 친구 삭제
     */
    public void deleteFriend(Long friendId) {
        User me = getCurrentUser();
        User target = userRepository.findById(friendId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        friendRepository.findByUserAndFriend(me, target).ifPresent(friendRepository::delete);
        friendRepository.findByUserAndFriend(target, me).ifPresent(friendRepository::delete);
    }

    /**
     * 사용자 차단
     */
    public void blockUser(Long userId) {
        User me = getCurrentUser();
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("차단 대상 사용자가 존재하지 않습니다."));

        if (me.getId().equals(target.getId())) {
            throw new IllegalArgumentException("자기 자신은 차단할 수 없습니다.");
        }

        if (friendBlockRepository.findByBlockerAndBlocked(me, target).isEmpty()) {
            friendBlockRepository.save(FriendBlock.builder()
                    .blocker(me)
                    .blocked(target)
                    .build());
        }

        deleteFriend(userId);
    }

    /**
     * 차단 해제
     */
    public void unblockUser(Long userId) {
        User me = getCurrentUser();
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        friendBlockRepository.findByBlockerAndBlocked(me, target)
                .ifPresent(friendBlockRepository::delete);
    }

    /**
     * 내가 차단한 사용자 목록 조회
     */
    public BlockedFriendListResponse getBlockedUsers() {
        User me = getCurrentUser();
        List<FriendBlock> blocks = friendBlockRepository.findByBlocker(me);
        return new BlockedFriendListResponse(
                blocks.stream()
                        .map(block -> BlockedFriendListResponse.BlockedUserDto.from(block.getBlocked()))
                        .collect(Collectors.toList())
        );
    }
}
