package com.nlp.back.service.community.block;

import com.nlp.back.dto.community.block.request.BlockTargetRequest;
import com.nlp.back.dto.community.block.request.UnblockTargetRequest;
import com.nlp.back.dto.community.block.response.BlockedUserListResponse;
import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.community.Block;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.global.exception.ErrorCode;
import com.nlp.back.repository.auth.UserRepository;
import com.nlp.back.repository.community.block.BlockRepository;
import com.nlp.back.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserRepository userRepository;

    /**
     * 👤 사용자 차단
     */
    public void blockUser(BlockTargetRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        User target = getUser(request.getTargetId());
        if (blockRepository.findByUserAndBlockedUser(user, target).isEmpty()) {
            Block block = Block.builder().user(user).blockedUser(target).build();
            blockRepository.save(block);
        }
    }

    /**
     * 🔓 사용자 차단 해제
     */
    public void unblockUser(UnblockTargetRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        User target = getUser(request.getTargetId());
        blockRepository.findByUserAndBlockedUser(user, target)
                .ifPresent(blockRepository::delete);
    }

    /**
     * 📋 차단한 사용자 목록 조회
     */
    public BlockedUserListResponse getBlockedUsers(HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        List<Block> blocks = blockRepository.findByUserAndBlockedUserIsNotNull(user);
        return new BlockedUserListResponse(
                blocks.stream()
                        .map(b -> BlockedUserListResponse.BlockedUserDto.from(b.getBlockedUser()))
                        .toList()
        );
    }

    // ===== 내부 유틸 =====

    private User getSessionUser(HttpServletRequest request) {
        Long userId = SessionUtil.getUserId(request);
        return getUser(userId);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
