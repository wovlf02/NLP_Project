package com.nlp.back.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * [LoginRequest]
 * 이메일 기반 로그인 요청 DTO
 */
@Getter
@NoArgsConstructor
public class LoginRequest {

    /** 이메일 */
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    /** 비밀번호 */
    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;
}
