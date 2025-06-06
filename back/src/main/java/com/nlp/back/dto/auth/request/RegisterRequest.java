package com.nlp.back.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * [RegisterRequest]
 * 회원가입 요청 DTO (React 기준 최소 필드만 유지)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "이름은 필수 입력값입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;
}
