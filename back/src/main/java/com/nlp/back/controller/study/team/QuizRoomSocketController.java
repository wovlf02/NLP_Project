package com.nlp.back.controller.study.team;

import com.nlp.back.dto.livekit.response.LiveKitTokenResponse;
import com.nlp.back.dto.study.team.socket.request.*;
import com.nlp.back.dto.study.team.socket.response.FileUploadNoticeResponse;
import com.nlp.back.dto.study.team.socket.response.VoteResultResponse;
import com.nlp.back.service.livekit.LiveKitService;
import com.nlp.back.service.study.team.chat.StudyChatService;
import com.nlp.back.service.study.team.socket.QuizRoomSocketService;
import com.nlp.back.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
@RequiredArgsConstructor
public class QuizRoomSocketController {

    private final QuizRoomSocketService quizRoomSocketService;
    private final SimpMessagingTemplate messagingTemplate;
    private final LiveKitService liveKitService;
    private final StudyChatService studyChatService;

    // ✅ 세션에서 userId 추출 유틸
    private Long extractUserId(HttpServletRequest request) {
        return SessionUtil.getUserId(request);
    }

    /**
     * ✅ REST 방식 토큰 발급 API (LiveKit 접속용)
     */
    @GetMapping("/livekit-token")
    public ResponseEntity<LiveKitTokenResponse> getLivekitToken(
            @RequestParam String roomName,
            @RequestParam(defaultValue = "false") boolean isPresenter,
            HttpServletRequest httpRequest
    ) {
        Long userId = extractUserId(httpRequest);
        LiveKitTokenResponse response = liveKitService.issueTokenResponse(userId.toString(), roomName, isPresenter);
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ 준비 상태 전달
     */
    @MessageMapping("/quiz/ready")
    public void ready(HttpServletRequest request, RoomReadyRequest dto) {
        quizRoomSocketService.setReady(dto.getRoomId(), extractUserId(request));
    }

    /**
     * ✅ 문제풀이 시작 요청
     */
    @MessageMapping("/quiz/start")
    public void startProblem(RoomStartRequest dto) {
        quizRoomSocketService.startProblem(
                dto.getRoomId(),
                dto.getUserId(),
                dto.getSubject(),
                dto.getUnit(),
                dto.getLevel()
        );
    }


    /**
     * ✅ 손들기 - 발표자 후보 등록
     */
    @MessageMapping("/quiz/hand")
    public void raiseHand(HttpServletRequest request, RoomHandRequest dto) {
        quizRoomSocketService.raiseHand(dto.getRoomId(), extractUserId(request));
    }

    /**
     * ✅ 발표 종료 처리
     */
    @MessageMapping("/quiz/end-presentation")
    public void endPresentation(HttpServletRequest request, RoomEndPresentationRequest dto) {
        quizRoomSocketService.endPresentation(dto.getRoomId(), extractUserId(request));
    }

    /**
     * ✅ 투표 제출 및 결과 전송
     */
    @MessageMapping("/quiz/vote")
    public void submitVote(HttpServletRequest request, VoteSubmitRequest dto) {
        Long userId = extractUserId(request);
        VoteResultResponse result = quizRoomSocketService.submitVote(dto.getRoomId(), userId, dto.getVote());
        if (result != null) {
            messagingTemplate.convertAndSend("/sub/quiz/room/" + dto.getRoomId(), result);
        }
    }

    /**
     * ✅ 문제풀이 종료 요청
     */
    @MessageMapping("/quiz/terminate")
    public void terminateRoom(HttpServletRequest request, RoomTerminateRequest dto) {
        quizRoomSocketService.terminateRoom(dto.getRoomId(), extractUserId(request));
    }

    /**
     * ✅ 파일 업로드 완료 알림
     */
    @MessageMapping("/quiz/file/uploaded")
    public void notifyFileUploaded(HttpServletRequest request, FileUploadNoticeRequest dto) {
        Long userId = extractUserId(request);
        FileUploadNoticeResponse response = quizRoomSocketService.notifyFileUploaded(dto, userId);
        messagingTemplate.convertAndSend("/sub/quiz/room/" + dto.getRoomId(), response);
    }

    /**
     * ✅ 정답 제출 요청 처리 (WebSocket)
     */
    @MessageMapping("/quiz/answer")
    public void submitAnswer(QuizAnswerRequest dto) {
        Long userId = dto.getUserId();
        quizRoomSocketService.submitAnswer(
                dto.getRoomId(),
                dto.getProblemId(),
                userId,
                dto.getNickname(),
                dto.getAnswer()
        );
    }
}
