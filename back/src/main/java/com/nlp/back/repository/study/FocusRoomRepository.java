package com.nlp.back.repository.study;

import com.nlp.back.entity.study.team.FocusRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FocusRoomRepository extends JpaRepository<FocusRoom, Long> {

    // ✅ 기본적으로 findById, save, deleteById 등 제공됨
}
