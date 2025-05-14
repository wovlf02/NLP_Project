package com.nlp.back.repository.friend;

import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.friend.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 친구 요청(FriendRequest) JPA Repository
 * <p>
 * 사용자가 보낸 또는 받은 친구 요청을 관리하며,
 * 중복 요청 방지 및 수락/거절을 위한 요청 ID 추적에 사용됩니다.
 * </p>
 */
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    /**
     * 특정 사용자 간 중복 요청 여부 확인
     */
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    /**
     * 특정 사용자가 받은 모든 친구 요청 조회
     */
    List<FriendRequest> findByReceiver(User receiver);

    /**
     * 친구 요청 수락 시 ID로 조회
     */
    Optional<FriendRequest> findById(Long id);

    boolean existsBySenderAndReceiver(User sender, User receiver);
}
