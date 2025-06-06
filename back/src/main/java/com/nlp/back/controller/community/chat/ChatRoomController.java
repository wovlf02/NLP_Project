package com.nlp.back.controller.community.chat;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.chat.request.ChatRoomCreateRequest;
import com.nlp.back.dto.community.chat.request.ChatRoomDeleteRequest;
import com.nlp.back.dto.community.chat.request.ChatRoomDetailRequest;
import com.nlp.back.dto.community.chat.response.ChatMessageResponse;
import com.nlp.back.dto.community.chat.response.ChatRoomListResponse;
import com.nlp.back.dto.community.chat.response.ChatRoomResponse;
import com.nlp.back.service.community.chat.ChatMessageService;
import com.nlp.back.service.community.chat.ChatRoomService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    /**
     * ✅ [추가] JSON 요청(이미지 없이) 채팅방 생성
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> createChatRoomJson(
            @RequestBody ChatRoomCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        ChatRoomResponse createdRoom = chatRoomService.createChatRoom(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("채팅방이 생성되었습니다.", createdRoom));
    }

    /**
     * ✅ 기존: Multipart 요청(이미지 포함) 채팅방 생성
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> createChatRoom(
            @RequestPart("request") ChatRoomCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest httpRequest
    ) {
        request.setImage(image);
        ChatRoomResponse createdRoom = chatRoomService.createChatRoom(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("채팅방이 생성되었습니다.", createdRoom));
    }

    /**
     * ✅ 내 채팅방 목록 조회
     */
    @GetMapping("/my")
    public ResponseEntity<MessageResponse> getMyChatRooms(HttpServletRequest httpRequest) {
        List<ChatRoomListResponse> rooms = chatRoomService.getMyChatRooms(httpRequest);
        return ResponseEntity.ok(MessageResponse.of("채팅방 목록 조회 성공", rooms));
    }

    /**
     * ✅ 채팅방 상세 조회
     */
    @PostMapping("/detail")
    public ResponseEntity<MessageResponse> getChatRoom(
            @RequestBody ChatRoomDetailRequest request,
            HttpServletRequest httpRequest
    ) {
        ChatRoomResponse roomInfo = chatRoomService.getChatRoomById(request);
        List<ChatMessageResponse> messages = chatMessageService.getAllMessages(request.getRoomId(), httpRequest);

        Map<String, Object> result = new HashMap<>();
        result.put("room_info", roomInfo);
        result.put("messages", messages);

        return ResponseEntity.ok(MessageResponse.of("채팅방 상세 조회 성공", result));
    }

    /**
     * ✅ 기존: body로 요청받는 채팅방 삭제 (body에 roomId 등 정보)
     */
    @DeleteMapping
    public ResponseEntity<MessageResponse> deleteChatRoom(
            @RequestBody ChatRoomDeleteRequest request,
            HttpServletRequest httpRequest
    ) {
        chatRoomService.deleteChatRoom(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("채팅방이 삭제되었습니다."));
    }

    /**
     * ✅ [신규] URL 경로로 roomId 받아서 채팅방 삭제 (프론트엔드에서 DELETE /api/chat/rooms/{roomId}로 요청할 때)
     */
    @DeleteMapping("/{roomId}")
    public ResponseEntity<MessageResponse> deleteChatRoomById(
            @PathVariable("roomId") Long roomId,   // ← 반드시 "roomId" 명시!
            HttpServletRequest httpRequest
    ) {
        chatRoomService.deleteChatRoomById(roomId, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("채팅방이 삭제되었습니다."));
    }
}
