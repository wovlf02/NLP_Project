package com.nlp.back.dto.community.report.request;

import lombok.*;

/**
 * 신고 요청 DTO
 * <p>
 * 사용자가 게시글, 댓글, 대댓글, 사용자 등을 신고할 때 사용하는 요청 형식입니다.
 * 신고 대상의 ID는 URI PathVariable로 전달되고,
 * 본 DTO는 신고자와 신고 사유를 포함합니다.
 * </p>
 *
 * 사용 예시:
 * <pre>
 * POST /api/community/posts/12/report
 * Body: {
 *   "reporterId": 10,
 *   "reason": "욕설과 비방이 포함되어 있습니다."
 * }
 * </pre>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    private String reason;
}

