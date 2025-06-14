package com.nlp.back.repository.dashboard;

import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.dashboard.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface StudyLogRepository extends JpaRepository<StudyLog, Long> {
    List<StudyLog> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);


}
