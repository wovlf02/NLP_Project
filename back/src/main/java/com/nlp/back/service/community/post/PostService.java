package com.nlp.back.service.community.post;

import com.nlp.back.dto.community.attachment.request.AttachmentIdRequest;
import com.nlp.back.dto.community.attachment.request.AttachmentUploadRequest;
import com.nlp.back.dto.community.post.request.*;
import com.nlp.back.dto.community.post.response.*;
import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.community.*;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.global.exception.ErrorCode;
import com.nlp.back.repository.auth.UserRepository;
import com.nlp.back.repository.community.post.PostFavoriteRepository;
import com.nlp.back.repository.community.post.PostRepository;
import com.nlp.back.service.community.attachment.AttachmentService;
import com.nlp.back.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostFavoriteRepository postFavoriteRepository;
    private final AttachmentService attachmentService;
    private final UserRepository userRepository;

    private Post getPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
    }

    private User getSessionUser(HttpServletRequest request) {
        Long userId = SessionUtil.getUserId(request);
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    /** ✅ 게시글 생성 */
    public Long createPost(PostCreateRequest request, MultipartFile file, HttpServletRequest httpRequest) {
        User writer = getSessionUser(httpRequest);

        PostCategory category;
        try {
            category = PostCategory.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new CustomException(ErrorCode.INVALID_POST_CATEGORY);
        }

        Post post = Post.builder()
                .writer(writer)
                .title(request.getTitle())
                .content(request.getContent())
                .category(category)
                .tag(request.getTag())
                .createdAt(LocalDateTime.now())
                .build();

        post = postRepository.save(post);

        if (file != null && !file.isEmpty()) {
            MultipartFile[] fileArray = new MultipartFile[]{file};
            attachmentService.uploadPostFiles(
                    new AttachmentUploadRequest(post.getId(), fileArray),
                    httpRequest
            );
        }

        return post.getId();
    }

    /** ✅ 게시글 수정 */
    @Transactional
    public void updatePost(PostUpdateRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Post post = getPostOrThrow(request.getPostId());

        if (!post.getWriter().getId().equals(user.getId())) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setUpdatedAt(LocalDateTime.now());

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            try {
                PostCategory category = PostCategory.valueOf(request.getCategory().toUpperCase());
                post.setCategory(category);
            } catch (IllegalArgumentException e) {
                throw new CustomException(ErrorCode.INVALID_INPUT);
            }
        }

        if (request.getTag() != null) {
            post.setTag(request.getTag());
        }

        if (request.getDeleteFileIds() != null) {
            for (Long fileId : request.getDeleteFileIds()) {
                attachmentService.deleteAttachment(new AttachmentIdRequest(fileId), httpRequest);
            }
        }

        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            MultipartFile[] fileArray = request.getFiles().toArray(new MultipartFile[0]);
            attachmentService.uploadPostFiles(new AttachmentUploadRequest(post.getId(), fileArray), httpRequest);
        }
    }

    /** ✅ 게시글 삭제 */
    public void deletePost(PostDeleteRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Post post = getPostOrThrow(request.getPostId());

        if (!post.getWriter().getId().equals(user.getId())) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        postRepository.delete(post);
    }

    /** ✅ 게시글 상세 조회 */
    public PostResponse getPostDetail(PostDetailRequest request) {
        Post post = getPostOrThrow(request.getPostId());
        post.incrementViewCount();
        postRepository.save(post);
        return PostResponse.from(post);
    }

    /** ✅ 게시글 목록 조회 (카테고리 + 검색 + 페이징 통합) */
    public PostListResponse getPostList(PostListRequest request) {
        int page = request.getPageOrDefault() - 1;
        int size = request.getSizeOrDefault();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        String searchType = request.getSearchTypeOrNull();
        String keyword = request.getKeywordOrNull();
        String categoryStr = request.getCategoryOrNull();

        PostCategory category = null;
        if (categoryStr != null) {
            try {
                category = PostCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new CustomException(ErrorCode.INVALID_POST_CATEGORY);
            }
        }

        Page<Post> result;

        if (keyword == null || keyword.isBlank()) {
            result = (category == null)
                    ? postRepository.findAll(pageable)
                    : postRepository.findAllByCategory(category, pageable);
        } else {
            switch (searchType) {
                case "title":
                    result = (category == null)
                            ? postRepository.findByTitleContainingIgnoreCase(keyword, pageable)
                            : postRepository.findByCategoryAndTitleContainingIgnoreCase(category, keyword, pageable);
                    break;
                case "content":
                    result = (category == null)
                            ? postRepository.findByContentContainingIgnoreCase(keyword, pageable)
                            : postRepository.findByCategoryAndContentContainingIgnoreCase(category, keyword, pageable);
                    break;
                case "author":
                    result = (category == null)
                            ? postRepository.findByWriter_NicknameContainingIgnoreCase(keyword, pageable)
                            : postRepository.findByCategoryAndWriter_NicknameContainingIgnoreCase(category, keyword, pageable);
                    break;
                case "title_content":
                default:
                    result = (category == null)
                            ? postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, pageable)
                            : postRepository.searchByCategoryAndKeyword(category, keyword, pageable);
                    break;
            }
        }

        return PostListResponse.from(
                result,
                category != null ? category.name() : null,
                keyword
        );
    }



    /** ✅ 인기 게시글 조회 */
    public PopularPostListResponse getPopularPosts() {
        Page<Post> posts = postRepository.findPopularPosts(PageRequest.of(0, 10));
        return PopularPostListResponse.from(posts.getContent());
    }

    /**
     * ✅ 문제풀이 실패 → 자동 게시글 템플릿 생성
     */
    public ProblemReferenceResponse autoFillPost(ProblemReferenceRequest request) {
        // category가 없거나 잘못된 경우 QUESTION으로 고정
        PostCategory category = PostCategory.QUESTION;

        String title = "[질문] " + request.getProblemTitle();

        StringBuilder content = new StringBuilder();
        content.append("### ❗ 풀이 실패 문제\n");
        content.append("- 문제 제목: ").append(request.getProblemTitle()).append("\n");
        if (request.getSource() != null) {
            content.append("- 출처: ").append(request.getSource()).append("\n");
        }
        content.append("- 분류: ").append(category.getLabel()).append("\n\n");
        content.append("### 📌 질문 내용\n");
        content.append("이 문제에 대해 팀 학습 중 풀이에 실패했습니다.\n");
        content.append("다른 사람들의 해결 전략이나 접근 방식을 공유해주세요!");

        return ProblemReferenceResponse.builder()
                .title(title)
                .content(content.toString())
                .category(category)
                .build();
    }


    /** ✅ 즐겨찾기 추가 */
    @Transactional
    public void favoritePost(PostFavoriteRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Post post = getPostOrThrow(request.getPostId());

        if (postFavoriteRepository.existsByUserAndPost(user, post)) {
            throw new CustomException(ErrorCode.DUPLICATE_LIKE);
        }

        postFavoriteRepository.save(PostFavorite.builder()
                .user(user)
                .post(post)
                .createdAt(LocalDateTime.now())
                .build());
    }

    /** ✅ 즐겨찾기 제거 */
    @Transactional
    public void unfavoritePost(PostFavoriteRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Post post = getPostOrThrow(request.getPostId());

        PostFavorite favorite = postFavoriteRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT));

        postFavoriteRepository.delete(favorite);
    }

    /** ✅ 즐겨찾기 목록 조회 */
    public FavoritePostListResponse getFavoritePosts(HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        List<PostFavorite> favorites = postFavoriteRepository.findAllByUser(user);
        List<PostSummaryResponse> posts = favorites.stream()
                .map(fav -> PostSummaryResponse.from(fav.getPost()))
                .collect(Collectors.toList());
        return new FavoritePostListResponse(posts);
    }

    /** ✅ 조회수 증가 */
    public void increaseViewCount(PostViewRequest request) {
        Post post = getPostOrThrow(request.getPostId());
        post.incrementViewCount();
        postRepository.save(post);
    }
}
