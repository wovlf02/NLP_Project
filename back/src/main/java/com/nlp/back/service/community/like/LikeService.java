package com.nlp.back.service.community.like;

import com.nlp.back.dto.community.like.request.*;
import com.nlp.back.dto.community.like.response.LikeCountResponse;
import com.nlp.back.dto.community.like.response.LikeStatusResponse;
import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.community.Comment;
import com.nlp.back.entity.community.Like;
import com.nlp.back.entity.community.Post;
import com.nlp.back.entity.community.Reply;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.global.exception.ErrorCode;
import com.nlp.back.repository.auth.UserRepository;
import com.nlp.back.repository.community.comment.CommentRepository;
import com.nlp.back.repository.community.comment.ReplyRepository;
import com.nlp.back.repository.community.like.LikeRepository;
import com.nlp.back.repository.community.post.PostRepository;
import com.nlp.back.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;

    // ===== 📌 게시글 =====

    public boolean togglePostLike(PostLikeToggleRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Post post = getPost(request.getPostId());

        return likeRepository.findByUserAndPost(user, post)
                .map(existing -> {
                    likeRepository.delete(existing);
                    post.decrementLikeCount();
                    postRepository.save(post);
                    return false;
                })
                .orElseGet(() -> {
                    likeRepository.save(Like.builder().user(user).post(post).build());
                    post.incrementLikeCount();
                    postRepository.save(post);
                    return true;
                });
    }

    public LikeCountResponse getPostLikeCount(PostLikeCountRequest request) {
        return new LikeCountResponse(likeRepository.countByPostId(request.getPostId()));
    }

    public LikeStatusResponse hasLikedPost(PostLikeStatusRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Post post = getPost(request.getPostId());
        boolean liked = likeRepository.findByUserAndPost(user, post).isPresent();
        return new LikeStatusResponse(liked);
    }

    // ===== 💬 댓글 =====

    public boolean toggleCommentLike(CommentLikeToggleRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Comment comment = getComment(request.getCommentId());

        return likeRepository.findByUserAndComment(user, comment)
                .map(existing -> {
                    likeRepository.delete(existing);
                    comment.decreaseLikeCount();
                    commentRepository.save(comment);
                    return false;
                })
                .orElseGet(() -> {
                    likeRepository.save(Like.builder().user(user).comment(comment).build());
                    comment.increaseLikeCount();
                    commentRepository.save(comment);
                    return true;
                });
    }

    public LikeCountResponse getCommentLikeCount(CommentLikeCountRequest request) {
        return new LikeCountResponse(likeRepository.countByCommentId(request.getCommentId()));
    }

    public LikeStatusResponse hasLikedComment(CommentLikeStatusRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Comment comment = getComment(request.getCommentId());
        boolean liked = likeRepository.findByUserAndComment(user, comment).isPresent();
        return new LikeStatusResponse(liked);
    }

    // ===== 🔁 대댓글 =====

    public boolean toggleReplyLike(ReplyLikeToggleRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Reply reply = getReply(request.getReplyId());

        return likeRepository.findByUserAndReply(user, reply)
                .map(existing -> {
                    likeRepository.delete(existing);
                    reply.decreaseLikeCount();
                    replyRepository.save(reply);
                    return false;
                })
                .orElseGet(() -> {
                    likeRepository.save(Like.builder().user(user).reply(reply).build());
                    reply.increaseLikeCount();
                    replyRepository.save(reply);
                    return true;
                });
    }

    public LikeCountResponse getReplyLikeCount(ReplyLikeCountRequest request) {
        return new LikeCountResponse(likeRepository.countByReplyId(request.getReplyId()));
    }

    public LikeStatusResponse hasLikedReply(ReplyLikeStatusRequest request, HttpServletRequest httpRequest) {
        User user = getSessionUser(httpRequest);
        Reply reply = getReply(request.getReplyId());
        boolean liked = likeRepository.findByUserAndReply(user, reply).isPresent();
        return new LikeStatusResponse(liked);
    }

    // ===== 🔍 유틸 =====

    private Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
    }

    private Comment getComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
    }

    private Reply getReply(Long replyId) {
        return replyRepository.findById(replyId)
                .orElseThrow(() -> new CustomException(ErrorCode.REPLY_NOT_FOUND));
    }

    private User getSessionUser(HttpServletRequest request) {
        Long userId = SessionUtil.getUserId(request);
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
