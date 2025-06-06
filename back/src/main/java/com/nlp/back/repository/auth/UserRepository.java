package com.nlp.back.repository.auth;

import com.nlp.back.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * [UserRepository]
 * 사용자 정보를 관리하는 JPA 리포지토리 (React 연동 최소 구성)
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /** 이메일 중복 여부 확인 */
    boolean existsByEmail(String email);

    /** 이메일로 사용자 조회 */
    Optional<User> findByEmail(String email);
}
