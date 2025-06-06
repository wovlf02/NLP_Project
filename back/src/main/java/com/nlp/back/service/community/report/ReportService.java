package com.nlp.back.service.community.report;

import com.nlp.back.dto.community.report.request.CommentReportRequest;
import com.nlp.back.dto.community.report.request.PostReportRequest;
import com.nlp.back.dto.community.report.request.ReplyReportRequest;
import com.nlp.back.dto.community.report.request.UserReportRequest;
import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.community.*;
import com.nlp.back.global.exception.CustomException;
import com.nlp.back.global.exception.ErrorCode;
import com.nlp.back.repository.auth.UserRepository;
import com.nlp.back.repository.community.comment.CommentRepository;
import com.nlp.back.repository.community.comment.ReplyRepository;
import com.nlp.back.repository.community.post.PostRepository;
import com.nlp.back.repository.community.report.ReportRepository;
import com.nlp.back.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;

    /** ✅ 게시글 신고 */
    public void reportPost(PostReportRequest request, HttpServletRequest httpRequest) {
        User reporter = getSessionUser(httpRequest);
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        if (reportRepository.findByReporterAndPost(reporter, post).isPresent()) {
            throw new CustomException(ErrorCode.ALREADY_REPORTED);
        }

        createReport(reporter, request.getReport(), post, null, null, null);
    }

    /** ✅ 댓글 신고 */
    public void reportComment(CommentReportRequest request, HttpServletRequest httpRequest) {
        User reporter = getSessionUser(httpRequest);
        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        if (reportRepository.findByReporterAndComment(reporter, comment).isPresent()) {
            throw new CustomException(ErrorCode.ALREADY_REPORTED);
        }

        createReport(reporter, request.getReport(), null, comment, null, null);
    }

    /** ✅ 대댓글 신고 */
    public void reportReply(ReplyReportRequest request, HttpServletRequest httpRequest) {
        User reporter = getSessionUser(httpRequest);
        Reply reply = replyRepository.findById(request.getReplyId())
                .orElseThrow(() -> new CustomException(ErrorCode.REPLY_NOT_FOUND));

        if (reportRepository.findByReporterAndReply(reporter, reply).isPresent()) {
            throw new CustomException(ErrorCode.ALREADY_REPORTED);
        }

        createReport(reporter, request.getReport(), null, null, reply, null);
    }

    /** ✅ 사용자 신고 */
    public void reportUser(UserReportRequest request, HttpServletRequest httpRequest) {
        User reporter = getSessionUser(httpRequest);
        User target = getUser(request.getTargetUserId());

        if (reporter.getId().equals(target.getId())) {
            throw new CustomException(ErrorCode.REPORT_SELF_NOT_ALLOWED);
        }

        if (reportRepository.findByReporterAndTargetUser(reporter, target).isPresent()) {
            throw new CustomException(ErrorCode.ALREADY_REPORTED);
        }

        createReport(reporter, request.getReport(), null, null, null, target);
    }

    /** ✅ 신고 생성 공통 처리 */
    private void createReport(User reporter, String reason,
                              Post post, Comment comment, Reply reply, User targetUser) {

        Report report = Report.builder()
                .reporter(reporter)
                .reason(reason)
                .status(ReportStatus.PENDING)
                .post(post)
                .comment(comment)
                .reply(reply)
                .targetUser(targetUser)
                .build();

        reportRepository.save(report);
    }

    /** ✅ 세션 유저 조회 */
    private User getSessionUser(HttpServletRequest request) {
        Long userId = SessionUtil.getUserId(request);
        return getUser(userId);
    }

    /** ✅ 유저 조회 공통 메서드 */
    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
