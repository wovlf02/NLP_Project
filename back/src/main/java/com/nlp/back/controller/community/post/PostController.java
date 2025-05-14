package com.nlp.back.controller.community.post;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.post.response.*;
import com.nlp.back.dto.community.post.request.PostCreateRequest;
import com.nlp.back.dto.community.post.request.PostUpdateRequest;
import com.nlp.back.dto.community.post.request.ProblemReferenceRequest;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.service.community.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 커뮤니티 게시글 API 컨트롤러
 */
@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 게시글 등록
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        try {
            PostCreateRequest request = objectMapper.readValue(postJson, PostCreateRequest.class);
            Long postId = postService.createPost(request, files);
            return ResponseEntity.ok(new MessageResponse("게시글이 등록되었습니다.", postId));
        } catch (JsonProcessingException e) {
            throw new CustomException("게시글 데이터 파싱 중 오류가 발생했습니다: " + e.getOriginalMessage());
        } catch (Exception e) {
            throw new CustomException("게시글 등록 중 오류가 발생했습니다.");
        }
    }

    /**
     * 게시글 수정
     */
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> updatePost(
            @PathVariable Long postId,
            @RequestPart("post") String postJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        try {
            PostUpdateRequest request = objectMapper.readValue(postJson, PostUpdateRequest.class);
            postService.updatePost(postId, request, files);
            return ResponseEntity.ok(new MessageResponse("게시글이 수정되었습니다."));
        } catch (JsonProcessingException e) {
            throw new CustomException("게시글 데이터 파싱 중 오류가 발생했습니다: " + e.getOriginalMessage());
        } catch (Exception e) {
            throw new CustomException("게시글 수정 중 오류가 발생했습니다.");
        }
    }

    /**
     * 게시글 삭제
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<MessageResponse> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok(new MessageResponse("게시글이 삭제되었습니다."));
    }

    /**
     * 게시글 목록 조회 (페이지네이션)
     */
    @GetMapping
    public ResponseEntity<PostListResponse> getPostList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(postService.getPostList(page, size));
    }

    /**
     * 게시글 상세 조회
     */
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostDetail(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostDetail(postId));
    }

    /**
     * 게시글 키워드 검색
     */
    @GetMapping("/search")
    public ResponseEntity<PostListResponse> searchPosts(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(postService.searchPosts(keyword, pageable));
    }

    /**
     * 조건별 게시글 필터링
     */
    @GetMapping("/filter")
    public ResponseEntity<PostListResponse> filterPosts(
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "0") int minLikes,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(postService.filterPosts(sort, minLikes, keyword));
    }

    /**
     * 인기 게시글 목록 조회
     */
    @GetMapping("/popular")
    public ResponseEntity<PopularPostListResponse> getPopularPosts() {
        return ResponseEntity.ok(postService.getPopularPosts());
    }

    /**
     * 게시글 활동 순위 조회
     */
    @GetMapping("/ranking")
    public ResponseEntity<RankingResponse> getPostRanking() {
        return ResponseEntity.ok(postService.getPostRanking());
    }

    /**
     * 실시간 문제풀이방 자동 완성
     */
    @PostMapping("/auto-fill")
    public ResponseEntity<PostAutoFillResponse> autoFillPost(@RequestBody ProblemReferenceRequest request) {
        return ResponseEntity.ok(postService.autoFillPost(request));
    }

    /**
     * 즐겨찾기 등록
     */
    @PostMapping("/{postId}/favorite")
    public ResponseEntity<MessageResponse> favoritePost(@PathVariable Long postId) {
        postService.favoritePost(postId);
        return ResponseEntity.ok(new MessageResponse("즐겨찾기에 추가되었습니다.", true));
    }

    /**
     * 즐겨찾기 해제
     */
    @DeleteMapping("/{postId}/favorite")
    public ResponseEntity<MessageResponse> unfavoritePost(@PathVariable Long postId) {
        postService.unfavoritePost(postId);
        return ResponseEntity.ok(new MessageResponse("즐겨찾기에서 제거되었습니다.", false));
    }

    /**
     * 즐겨찾기한 게시글 목록 조회
     */
    @GetMapping("/favorites")
    public ResponseEntity<FavoritePostListResponse> getFavoritePosts() {
        return ResponseEntity.ok(postService.getFavoritePosts());
    }
}
