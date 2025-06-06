package com.nlp.back.service.auth;

import com.nlp.back.dto.auth.request.LoginRequest;
import com.nlp.back.dto.auth.request.RegisterRequest;
import com.nlp.back.dto.auth.response.LoginResponse;
import com.nlp.back.entity.auth.User;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.global.exception.ErrorCode;
import com.nlp.back.repository.auth.UserRepository;
import com.nlp.back.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;

    /**
     * ✅ 회원가입 처리 (React JSON 기반)
     */
    public void register(RegisterRequest request, HttpServletRequest httpRequest) {
        // 1. 이메일 중복 검사
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 2. 유저 엔티티 생성 및 저장
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // 실서비스에선 해싱 필수
                .build();

        user = userRepository.save(user);

        // 3. 자동 로그인 처리 (세션 저장)
        httpRequest.getSession(true).setAttribute("userId", user.getId());
    }

    /**
     * ✅ 로그인 처리
     */
    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGIN_USER_NOT_FOUND));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new CustomException(ErrorCode.LOGIN_PASSWORD_MISMATCH);
        }

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", user.getId());

        return LoginResponse.from(user);
    }

    /**
     * ✅ 회원 탈퇴
     */
    public void withdraw(HttpServletRequest request) {
        Long userId = SessionUtil.getUserId(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        userRepository.delete(user);
    }
}
