package com.nlp.back.dto.community.friend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * [FriendSearchRequest]
 * 닉네임 기반 친구 검색 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendSearchRequest {

    @NotBlank(message = "nickname은 필수입니다.")
    private String nickname;
}
