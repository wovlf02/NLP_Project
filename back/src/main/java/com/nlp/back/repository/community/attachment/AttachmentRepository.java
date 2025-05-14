package com.nlp.back.repository.community.attachment;

import com.nlp.back.entity.community.Attachment;
import com.nlp.back.entity.community.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 첨부파일(Attachment) 관련 JPA Repository
 * <p>
 * 게시글에 첨부된 파일을 조회하거나 삭제할 때 사용됩니다.
 * </p>
 */
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    /**
     * 게시글 ID로 첨부파일 조회
     */
    List<Attachment> findByPostId(Long postId);

    /**
     * 게시글 엔티티로 첨부파일 조회
     */
    List<Attachment> findByPost(Post post);
}
