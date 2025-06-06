package com.nlp.back.controller.community.post;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.post.request.*;
import com.nlp.back.dto.community.post.response.*;
import com.nlp.back.service.community.post.PostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /** ✅ 게시글 생성 (multipart/form-data) */
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<MessageResponse> createPost(
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("category") String category,
            @RequestPart(value = "tag", required = false) String tag,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest httpRequest
    ) {
        PostCreateRequest request = PostCreateRequest.builder()
                .title(title)
                .content(content)
                .category(category)
                .tag(tag)
                .build();

        Long postId = postService.createPost(request, file, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("게시글이 등록되었습니다.", postId));
    }

    /** ✅ 게시글 수정 (multipart/form-data) */
    @PostMapping(value = "/update", consumes = "multipart/form-data")
    public ResponseEntity<MessageResponse> updatePost(
            @ModelAttribute PostUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        postService.updatePost(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("게시글이 수정되었습니다."));
    }

    /** ✅ 게시글 삭제 */
    @PostMapping("/delete")
    public ResponseEntity<MessageResponse> deletePost(
            @RequestBody PostDeleteRequest request,
            HttpServletRequest httpRequest
    ) {
        postService.deletePost(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("게시글이 삭제되었습니다."));
    }

    /** ✅ 게시글 목록 조회 (카테고리 + 검색 + 페이징 통합) */
    @PostMapping("/list")
    public ResponseEntity<PostListResponse> getPostList(@RequestBody PostListRequest request) {
        return ResponseEntity.ok(postService.getPostList(request));
    }

    /** ✅ 게시글 상세 조회 */
    @PostMapping("/detail")
    public ResponseEntity<PostResponse> getPostDetail(@RequestBody PostDetailRequest request) {
        return ResponseEntity.ok(postService.getPostDetail(request));
    }

    /** ✅ 인기 게시글 조회 */
    @GetMapping("/popular")
    public ResponseEntity<PopularPostListResponse> getPopularPosts() {
        return ResponseEntity.ok(postService.getPopularPosts());
    }

    /** ✅ 문제 기반 자동 완성 */
    @PostMapping("/auto-fill")
    public ResponseEntity<ProblemReferenceResponse> autoFillPost(@RequestBody ProblemReferenceRequest request) {
        return ResponseEntity.ok(postService.autoFillPost(request));
    }

    /** ✅ 게시글 즐겨찾기 추가 */
    @PostMapping("/favorite/add")
    public ResponseEntity<MessageResponse> favoritePost(
            @RequestBody PostFavoriteRequest request,
            HttpServletRequest httpRequest
    ) {
        postService.favoritePost(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("즐겨찾기에 추가되었습니다.", true));
    }

    /** ✅ 게시글 즐겨찾기 제거 */
    @PostMapping("/favorite/remove")
    public ResponseEntity<MessageResponse> unfavoritePost(
            @RequestBody PostFavoriteRequest request,
            HttpServletRequest httpRequest
    ) {
        postService.unfavoritePost(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("즐겨찾기에서 제거되었습니다.", false));
    }

    /** ✅ 즐겨찾기 게시글 목록 조회 */
    @GetMapping("/favorites")
    public ResponseEntity<FavoritePostListResponse> getFavoritePosts(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(postService.getFavoritePosts(httpRequest));
    }

    /** ✅ 게시글 조회수 증가 */
    @PatchMapping("/view")
    public ResponseEntity<MessageResponse> increaseViewCount(@RequestBody PostViewRequest request) {
        postService.increaseViewCount(request);
        return ResponseEntity.ok(MessageResponse.of("조회수가 증가되었습니다."));
    }
}
