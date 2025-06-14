package com.nlp.back.repository.plan;

import com.nlp.back.entity.plan.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {
    List<StudyPlan> findByUserId(String userId);
    List<StudyPlan> findByUserIdAndSubject(String userId, String subject);
}
