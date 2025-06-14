package com.nlp.back.controller.community.attachment;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.attachment.request.AttachmentUploadRequest;
import com.nlp.back.dto.community.attachment.request.AttachmentIdRequest;
import com.nlp.back.dto.community.attachment.request.PostIdRequest;
import com.nlp.back.dto.community.attachment.response.AttachmentListResponse;
import com.nlp.back.service.community.attachment.AttachmentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    /** ✅ 게시글 첨부파일 업로드 (세션 기반) */
    @PostMapping("/attachments/upload")
    public ResponseEntity<MessageResponse> uploadPostAttachments(
            @ModelAttribute AttachmentUploadRequest request,
            HttpServletRequest httpRequest
    ) {
        int uploadedCount = attachmentService.uploadPostFiles(request, httpRequest);
        return ResponseEntity.ok(
                MessageResponse.of("✅ 첨부파일이 업로드되었습니다. (" + uploadedCount + "개)")
        );
    }

    /** ✅ 게시글 첨부파일 목록 조회 */
    @PostMapping("/attachments/list")
    public ResponseEntity<AttachmentListResponse> getPostAttachments(@RequestBody PostIdRequest request) {
        return ResponseEntity.ok(attachmentService.getPostAttachments(request));
    }

    /** ✅ 첨부파일 다운로드 */
    @PostMapping("/attachments/download")
    public ResponseEntity<Resource> downloadAttachment(@RequestBody AttachmentIdRequest request) {
        Resource resource = attachmentService.downloadAttachment(request);
        String filename = resource.getFilename();
        String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                .body(resource);
    }

    /** ✅ 첨부파일 삭제 (세션 기반) */
    @PostMapping("/attachments/delete")
    public ResponseEntity<MessageResponse> deleteAttachment(
            @RequestBody AttachmentIdRequest request,
            HttpServletRequest httpRequest
    ) {
        attachmentService.deleteAttachment(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("🗑️ 첨부파일이 삭제되었습니다."));
    }
}
