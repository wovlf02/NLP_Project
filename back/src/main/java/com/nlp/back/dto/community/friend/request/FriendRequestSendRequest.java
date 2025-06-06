package com.nlp.back.dto.community.friend.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * [FriendRequestSendRequest]
 * 친구 요청 전송 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendRequestSendRequest {

    @NotNull(message = "targetUserId는 필수입니다.")
    private Long targetUserId;
}
