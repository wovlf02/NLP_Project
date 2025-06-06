package com.nlp.back.controller.auth;

import com.nlp.back.dto.auth.request.LoginRequest;
import com.nlp.back.dto.auth.request.RegisterRequest;
import com.nlp.back.dto.auth.response.LoginResponse;
import com.nlp.back.global.response.ApiResponse;
import com.nlp.back.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * [AuthController]
 * 로그인/회원가입/탈퇴 처리 컨트롤러
 * - JSON 기반 요청 처리 (React 프론트와 연동)
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** ✅ 회원가입 요청 - JSON 기반 */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @RequestBody @Valid RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.register(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("✅ 회원가입이 완료되었습니다."));
    }

    /** ✅ 로그인 요청 - 사용자 전체 정보 반환 + 세션 저장 */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        LoginResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /** ✅ 회원 탈퇴 - 세션 기반 사용자 식별 */
    @DeleteMapping("/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdraw(HttpServletRequest request) {
        authService.withdraw(request);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
