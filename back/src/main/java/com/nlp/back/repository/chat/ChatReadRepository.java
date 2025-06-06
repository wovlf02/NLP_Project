package com.nlp.back.repository.chat;

import com.nlp.back.entity.chat.ChatRead;
import com.nlp.back.entity.chat.ChatMessage;
import com.nlp.back.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param; // ✅ 추가

/**
 * [ChatReadRepository]
 *
 * 메시지 읽음 상태(ChatRead) 관련 JPA Repository입니다.
 * - 누가 어떤 메시지를 읽었는지 추적합니다.
 * - 메시지별 읽음 수, 사용자별 읽음 여부 확인 등에 사용됩니다.
 */
public interface ChatReadRepository extends JpaRepository<ChatRead, Long> {

    /**
     * [메시지 읽은 사용자 수 조회]
     *
     * @param message 대상 메시지
     * @return 해당 메시지를 읽은 사용자 수
     */
    long countByMessage(@Param("message") ChatMessage message); // ✅ @Param 추가

    /**
     * [특정 메시지를 특정 사용자가 읽었는지 여부]
     *
     * @param message 대상 메시지
     * @param user 사용자
     * @return 읽었으면 true, 아니면 false
     */
    boolean existsByMessageAndUser(ChatMessage message, User user);
}
