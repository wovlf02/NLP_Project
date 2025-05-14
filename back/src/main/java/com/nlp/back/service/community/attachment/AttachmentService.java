package com.nlp.back.service.community.attachment;

import com.nlp.back.dto.community.attachment.response.AttachmentListResponse;
import com.nlp.back.dto.community.attachment.response.AttachmentResponse;
import com.nlp.back.entity.community.Attachment;
import com.nlp.back.entity.community.Post;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.global.exception.ErrorCode;
import com.nlp.back.global.security.SecurityUtil;
import com.nlp.back.repository.community.attachment.AttachmentRepository;
import com.nlp.back.repository.community.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private static final String ATTACHMENT_DIR = "uploads/community/";

    private final AttachmentRepository attachmentRepository;
    private final PostRepository postRepository;
    private final SecurityUtil securityUtil;

    // ===== 첨부파일 업로드 =====

    public int uploadPostFiles(Long postId, MultipartFile[] files) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));

        List<Attachment> attachments = saveFiles(files).stream()
                .map(fileMeta -> Attachment.builder()
                        .post(post)
                        .originalFileName(fileMeta.original())
                        .storedFileName(fileMeta.stored())
                        .contentType(fileMeta.type())
                        .previewAvailable(isPreviewable(fileMeta.type()))
                        .build())
                .collect(Collectors.toList());

        attachmentRepository.saveAll(attachments);
        return attachments.size();
    }

    // ===== 목록 조회 =====

    public AttachmentListResponse getPostAttachments(Long postId) {
        List<Attachment> list = attachmentRepository.findByPostId(postId);
        return toListResponse(list);
    }

    // ===== 파일 다운로드 =====

    public Resource downloadAttachment(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("첨부파일을 찾을 수 없습니다."));

        try {
            Path path = Paths.get(ATTACHMENT_DIR).resolve(attachment.getStoredFileName()).normalize();
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("파일이 존재하지 않습니다.");
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("파일 경로 오류", e);
        }
    }

    // ===== 삭제 =====

    public void deleteAttachment(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 첨부파일이 존재하지 않습니다."));

        Long currentUserId = securityUtil.getCurrentUserId();
        Long ownerId = attachment.getPost().getWriter().getId();

        if (!ownerId.equals(currentUserId)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED); // 권한 없음
        }

        Path filePath = Paths.get(ATTACHMENT_DIR).resolve(attachment.getStoredFileName()).normalize();
        try {
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제 중 오류 발생", e);
        }

        attachmentRepository.delete(attachment);
    }


    // ===== 내부 유틸 =====

    private AttachmentListResponse toListResponse(List<Attachment> list) {
        List<AttachmentResponse> result = list.stream()
                .map(file -> AttachmentResponse.builder()
                        .attachmentId(file.getId())
                        .originalName(file.getOriginalFileName())
                        .storedName(file.getStoredFileName())
                        .contentType(file.getContentType())
                        .previewAvailable(file.isPreviewAvailable())
                        .build())
                .collect(Collectors.toList());
        return new AttachmentListResponse(result);
    }

    private record FileMeta(String original, String stored, String type) {}

    private List<FileMeta> saveFiles(MultipartFile[] files) {
        try {
            Path dirPath = Paths.get(ATTACHMENT_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            return Arrays.stream(files)
                    .filter(file -> !file.isEmpty())
                    .map(file -> {
                        String original = file.getOriginalFilename();
                        if (original == null || !original.contains(".")) {
                            throw new IllegalArgumentException("파일 이름이 유효하지 않습니다: 확장자가 없습니다.");
                        }

                        String extension = original.substring(original.lastIndexOf('.') + 1);
                        String stored = UUID.randomUUID() + "_" + original;

                        try {
                            Path target = dirPath.resolve(stored);
                            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                        } catch (Exception e) {
                            throw new RuntimeException("파일 저장 실패", e);
                        }

                        return new FileMeta(original, stored, extension);
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    private boolean isPreviewable(String contentTypeOrExtension) {
        String lower = contentTypeOrExtension.toLowerCase();
        return lower.matches(".*(jpg|jpeg|png|gif|bmp|webp)$") || lower.startsWith("image/");
    }
}
