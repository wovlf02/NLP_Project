package com.nlp.back.dto.auth.request;

import lombok.Getter;
import lombok.Setter;

/**
 * [UserDto]
 * 로그인 응답 또는 사용자 요약 정보 DTO (React 기준 최소화)
 */
@Getter
@Setter
public class UserDto {

    /** 사용자 실명 */
    private String name;

    /** 이메일 주소 */
    private String email;

    public UserDto(String name, String email) {
        this.name = name;
        this.email = email;
    }
}
