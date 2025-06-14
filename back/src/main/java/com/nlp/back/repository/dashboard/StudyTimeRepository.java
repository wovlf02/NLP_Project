package com.nlp.back.repository.dashboard;

import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.dashboard.StudyTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyTimeRepository extends JpaRepository<StudyTime, Long> {
    Optional<StudyTime> findByUser(User user);
}
