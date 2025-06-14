package com.nlp.back.controller.dashboard;

import com.nlp.back.dto.common.MessageResponse;
import com.nlp.back.dto.community.notice.response.NoticeResponse;
import com.nlp.back.dto.dashboard.calendar.CalendarEventDto;
import com.nlp.back.dto.dashboard.calendar.request.CalendarRequest;
import com.nlp.back.dto.dashboard.exam.request.ExamScheduleRequest;
import com.nlp.back.dto.dashboard.exam.response.DDayInfoResponse;
import com.nlp.back.dto.dashboard.exam.response.ExamScheduleResponse;
import com.nlp.back.dto.dashboard.goal.request.GoalUpdateRequest;
import com.nlp.back.dto.dashboard.goal.response.GoalSuggestionResponse;
import com.nlp.back.dto.dashboard.reflection.request.OptionReflectionRequest;
import com.nlp.back.dto.dashboard.reflection.request.RangeReflectionRequest;
import com.nlp.back.dto.dashboard.reflection.request.WeeklyReflectionRequest;
import com.nlp.back.dto.dashboard.reflection.response.WeeklyReflectionResponse;
import com.nlp.back.dto.dashboard.stats.response.*;
import com.nlp.back.dto.dashboard.time.request.StudyTimeUpdateRequest;
import com.nlp.back.dto.dashboard.todo.request.*;
import com.nlp.back.dto.dashboard.todo.response.TodoResponse;
import com.nlp.back.entity.auth.User;
import com.nlp.back.global.response.ApiResponse;
import com.nlp.back.service.dashboard.DashboardService;
import com.nlp.back.service.dashboard.GPTReflectionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final GPTReflectionService gptReflectionService;

    // 📆 월별 캘린더 이벤트
    @PostMapping("/calendar")
    public ResponseEntity<List<CalendarEventDto>> getMonthlyCalendarEvents(
            @RequestBody CalendarRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyCalendarEvents(request, httpRequest));
    }

    // 📅 특정 날짜 Todo
    @PostMapping("/todos/date")
    public ResponseEntity<List<TodoResponse>> getTodosByDate(
            @RequestBody TodoDateRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(dashboardService.getTodosByDate(request, httpRequest));
    }

    /**
     * Todo 생성
     */
    @PostMapping("/todos")
    public ResponseEntity<MessageResponse> createTodo(
            @Valid @RequestBody TodoRequest request,
            HttpServletRequest httpRequest) {
        log.info("📝 Todo 생성 요청 - title: {}, date: {}, priority: {}", 
            request.getTitle(), request.getTodoDate(), request.getPriority());
            
        User user = dashboardService.getSessionUser(httpRequest);
        TodoResponse response = dashboardService.createTodo(request, user);
        log.info("✅ Todo 생성 완료 - id: {}, date: {}", response.getId(), response.getTodoDate());
        
        return ResponseEntity.ok(MessageResponse.of("✅ Todo가 생성되었습니다."));
    }

    // ✅ Todo 수정
    @PutMapping("/todos")
    public ResponseEntity<MessageResponse> updateTodo(@RequestBody TodoUpdateRequest request) {
        dashboardService.updateTodo(request);
        return ResponseEntity.ok(MessageResponse.of("✏️ Todo가 수정되었습니다."));
    }

    // ✅ Todo 삭제
    @PostMapping("/todos/delete")
    public ResponseEntity<MessageResponse> deleteTodo(
            @RequestBody TodoDeleteRequest request,
            HttpServletRequest httpRequest
    ) {
        dashboardService.deleteTodo(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("🗑️ Todo가 삭제되었습니다."));
    }

    // ✅ Todo 완료 토글
    @PutMapping("/todos/complete")
    public ResponseEntity<MessageResponse> toggleTodoCompletion(
            @RequestBody TodoToggleRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("�� Todo 완료 상태 변경 요청 - request: {}", request);
        log.info("🔄 Todo 완료 상태 변경 요청 - todoId: {}", request.getTodoId());
        try {
            dashboardService.toggleTodoCompletion(request);
            return ResponseEntity.ok(MessageResponse.of("✅ Todo가 완료되었습니다."));
        } catch (Exception e) {
            log.error("❌ Todo 완료 상태 변경 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    // 🗓 시험 일정 전체 조회
    @GetMapping("/exams")
    public ResponseEntity<ApiResponse<List<ExamScheduleResponse>>> getExamSchedules(HttpServletRequest httpRequest) {
        List<ExamScheduleResponse> schedules = dashboardService.getAllExamSchedules(httpRequest);
        return ResponseEntity.ok(ApiResponse.ok(schedules));
    }

    // 🗓 시험 일정 등록
    @PostMapping("/exams/register")
    public ResponseEntity<ApiResponse<Void>> createExamSchedule(
            @RequestBody ExamScheduleRequest request,
            HttpServletRequest httpRequest
    ) {
        dashboardService.createExamSchedule(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 🗓 시험 일정 삭제
    @DeleteMapping("/exams/{examId}")
    public ResponseEntity<MessageResponse> deleteExamSchedule(
            @PathVariable Long examId,
            HttpServletRequest httpRequest
    ) {
        dashboardService.deleteExamSchedule(examId, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("🗑️ 시험 일정이 삭제되었습니다."));
    }

    // 🗓 D-Day 조회
    @PostMapping("/exams/nearest")
    public ResponseEntity<DDayInfoResponse> getNearestExam(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getNearestExamSchedule(httpRequest));
    }

    // 📊 전체 통계
    @PostMapping("/stats/total")
    public ResponseEntity<TotalStatsResponse> getTotalStats(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getTotalStudyStats(httpRequest));
    }

    // 📊 과목별 통계
    @PostMapping("/stats/subjects")
    public ResponseEntity<List<SubjectStatsResponse>> getSubjectStats(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getSubjectStats(httpRequest));
    }

    // 📊 주간 통계
    @PostMapping("/stats/weekly")
    public ResponseEntity<WeeklyStatsResponse> getWeeklyStats(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getWeeklyStats(httpRequest));
    }

    // 📊 월간 통계
    @PostMapping("/stats/monthly")
    public ResponseEntity<MonthlyStatsResponse> getMonthlyStats(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getMonthlyStats(httpRequest));
    }

    // 📊 최고 집중일
    @PostMapping("/stats/best-day")
    public ResponseEntity<BestFocusDayResponse> getBestFocusDay(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getBestFocusDay(httpRequest));
    }

    // 🏁 목표 제안
    @PostMapping("/goal/suggest")
    public ResponseEntity<GoalSuggestionResponse> suggestGoal(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getSuggestedGoal(httpRequest));
    }

    // 🏁 목표 수동 설정
    @PutMapping("/goal")
    public ResponseEntity<MessageResponse> updateGoal(
            @RequestBody GoalUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        dashboardService.updateGoalManually(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("🎯 목표가 업데이트되었습니다."));
    }

    // 🧠 주간 회고
    @PostMapping("/reflection/weekly")
    public ResponseEntity<WeeklyReflectionResponse> generateWeeklyReflection(
            @RequestBody WeeklyReflectionRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(gptReflectionService.generateWeeklyReflection(request, httpRequest));
    }

    // 🧠 기간 회고
    @PostMapping("/reflection/range")
    public ResponseEntity<WeeklyReflectionResponse> generateReflectionByRange(
            @RequestBody RangeReflectionRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(gptReflectionService.generateReflectionByRange(request, httpRequest));
    }

    // 🧠 선택 기반 회고
    @PostMapping("/reflection/custom")
    public ResponseEntity<WeeklyReflectionResponse> generateCustomReflection(
            @RequestBody OptionReflectionRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(gptReflectionService.generateCustomReflection(request, httpRequest));
    }

    @PostMapping("/study-time")
    public ResponseEntity<MessageResponse> updateStudyTime(
            @RequestBody StudyTimeUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        dashboardService.updateStudyTime(request, httpRequest);
        return ResponseEntity.ok(MessageResponse.of("공부시간 설정이 저장되었습니다."));
    }

    // 📢 공지사항 조회
    @GetMapping("/notices")
    public ResponseEntity<List<NoticeResponse>> getNotices() {
        return ResponseEntity.ok(dashboardService.getNotices());
    }

    // 📅 모든 Todo 조회
    @GetMapping("/todos")
    public ResponseEntity<List<TodoResponse>> getAllTodos(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(dashboardService.getAllTodos(httpRequest));
    }

}
