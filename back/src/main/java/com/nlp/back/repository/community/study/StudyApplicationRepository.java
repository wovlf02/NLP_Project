package com.nlp.back.repository.community.study;

import com.nlp.back.entity.auth.User;
import com.nlp.back.entity.community.SidebarStudy;
import com.nlp.back.entity.community.StudyApplication;
import com.nlp.back.entity.community.StudyApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyApplicationRepository extends JpaRepository<StudyApplication, Long> {
    boolean existsByStudyAndUserAndStatus(SidebarStudy study, User user, StudyApplicationStatus status);
    // StudyApplicationRepository.java
    List<StudyApplication> findByStudyAndStatus(SidebarStudy study, StudyApplicationStatus status);
    Optional<StudyApplication> findByStudyAndUser(SidebarStudy study, User user);

}
