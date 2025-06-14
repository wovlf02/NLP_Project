package com.nlp.back.dto.dashboard.calendar.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.YearMonth;

/**
 * 월별 캘린더 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarRequest {

    @NotNull(message = "월 정보는 필수입니다.")
    private YearMonth month;
}
