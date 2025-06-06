package com.nlp.back.dto.community.friend.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * 친구 요청 취소 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendCancelRequest {

    @NotNull(message = "requestId는 필수입니다.")
    private Long requestId;
}
