package com.nlp.back.entity.auth;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사용자 실명 */
    @Column(nullable = false, length = 50)
    private String name;

    /** 이메일 (로그인 ID) */
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /** 비밀번호 */
    @Column(nullable = false)
    private String password;

    /** 생성 시각 */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 수정 시각 */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /** 생성/수정 시각 자동 처리 */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** 비밀번호 변경 */
    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    /** ID로 유저 객체 생성 (참조용) */
    public static User of(Long id) {
        User user = new User();
        user.setId(id);
        return user;
    }
}
