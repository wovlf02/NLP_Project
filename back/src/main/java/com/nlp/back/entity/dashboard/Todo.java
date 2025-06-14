package com.nlp.back.entity.dashboard;

import com.nlp.back.entity.auth.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "todo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 할 일 제목 */
    @Column(nullable = false, length = 100)
    private String title;

    /** 할 일 설명 (선택) */
    @Column(length = 1000)
    private String description;

    /** 할 일 날짜 (YYYY-MM-DD) */
    @Column(name = "todo_date", nullable = false, columnDefinition = "DATE")
    private LocalDate todoDate;

    /** 우선순위 (LOW, NORMAL, HIGH) */
    @Enumerated(EnumType.STRING) // ✅ 문자열로 저장
    @Column(nullable = false)
    private PriorityLevel priority;

    /** 완료 여부 */
    @Builder.Default
    @Column(nullable = false)
    private boolean completed = false;

    /** 작성자 (N:1) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ====================
    // ✅ 내부 로직 메서드
    // ====================

    /** 할 일을 완료 상태로 설정 */
    public void markAsCompleted() {
        this.completed = true;
    }

    /** 할 일을 미완료 상태로 설정 */
    public void markAsIncomplete() {
        this.completed = false;
    }

    /** 완료 상태를 토글 */
    public void toggleCompletion() {
        this.completed = !this.completed;
    }

    /** 완료 상태 여부 반환 */
    public boolean isCompleted() {
        return this.completed;
    }
}
