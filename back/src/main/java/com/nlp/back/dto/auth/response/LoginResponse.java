package com.nlp.back.dto.auth.response;

import com.nlp.back.entity.auth.User;
import lombok.Builder;
import lombok.Getter;

/**
 * 로그인 응답 DTO (화면 전용 최소 필드만 포함)
 */
@Getter
@Builder
public class LoginResponse {

    private String name;
    private String email;

    public static LoginResponse from(User user) {
        return LoginResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
