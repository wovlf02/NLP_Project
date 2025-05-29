import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { boardApi, emotionApi } from '../../api/mockApi';
import WarningModal from '../Common/WarningModal';

const CommentSectionContainer = styled.div`
  margin-top: 2rem;
`;

const CommentHeader = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  border-radius: 8px;
  padding: ${props => props.isReply ? '1rem 0 0 2.5rem' : '1rem 0'};
  position: relative;
  
  &:not(:last-child) {
    border-bottom: ${props => props.isReply ? 'none' : '1px solid #e9ecef'};
    padding-bottom: 1rem;
  }
  
  ${props => props.isReply && `
    &:before {
      content: '';
      position: absolute;
      left: 1rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: #e9ecef;
    }
  `}
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const AuthorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #495057;
`;

const AuthorName = styled.span`
  font-weight: 500;
  color: #495057;
`;

const CommentDate = styled.span`
  font-size: 0.8rem;
  color: #adb5bd;
`;

const CommentContent = styled.div`
  margin: 0.5rem 0;
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CommentAction = styled.button`
  background: none;
  border: none;
  color: #868e96;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #495057;
    text-decoration: underline;
  }
`;

const ReplyForm = styled.div`
  margin-top: 1rem;
  margin-left: ${props => props.isReply ? '2.5rem' : '0'};
`;

const CommentForm = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
  }
`;

const EmotionIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  background-color: ${props => {
    if (props.score >= 0.7) return '#e3f2fd'; // 긍정
    if (props.score <= 0.3) return '#ffebee'; // 부정
    return '#f5f5f5'; // 중립
  }};
  color: ${props => {
    if (props.score >= 0.7) return '#1976d2'; // 긍정
    if (props.score <= 0.3) return '#d32f2f'; // 부정
    return '#757575'; // 중립
  }};
`;

function getEmotionIcon(score) {
  if (score >= 0.7) return '😊'; // 긍정
  if (score <= 0.3) return '😔'; // 부정
  return '😐'; // 중립
}

function CommentSection({ postId, onCommentsChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(1); // 임시 사용자 ID
  
  // 감정 분석 관련 상태
  const [showWarning, setShowWarning] = useState(false);
  const [pendingCommentData, setPendingCommentData] = useState(null);
  const [pendingEmotionScore, setPendingEmotionScore] = useState(null);
  const [violationType, setViolationType] = useState('general');
  
  // 컴포넌트 외부에서도 사용할 수 있도록 함수를 밖으로 이동
  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log('Fetching comments for postId:', postId);
      const response = await boardApi.getComments(postId);
      
      console.log('Comment API response:', response);
      
      if (response.success) {
        setComments(response.data);
        // 부모 컴포넌트에 댓글 수 변경 알림
        if (onCommentsChange) {
          onCommentsChange(response.data.length);
        }
      } else {
        console.error('Error from API:', response.error);
        setError(response.error);
      }
    } catch (err) {
      console.error('댓글 조회 실패:', err);
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // 컴포넌트 마운트 시 댓글 불러오기
    console.log('CommentSection useEffect triggered with postId:', postId);
    fetchComments();
  }, [postId]);
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      // 감정 분석
      const emotionResponse = await emotionApi.analyzeEmotion(newComment);
      
      if (emotionResponse.success) {
        const emotionScore = emotionResponse.data.score;
        const detectedViolationType = emotionResponse.data.violationType;
        
        // 부정적인 감정이 감지되면 (점수가 0.3 이하)
        if (emotionScore <= 0.3 && detectedViolationType) {
          // 경고 모달 표시를 위한 데이터 저장
          setPendingCommentData({
            post_id: postId,
            content: newComment
          });
          setPendingEmotionScore(emotionScore);
          setViolationType(detectedViolationType);
          setShowWarning(true);
          return;
        }
        
        // 부정적 감정이 없는 경우 바로 댓글 작성
        const commentResponse = await boardApi.createComment(
          {
            post_id: postId,
            content: newComment,
            emotion_score: emotionScore
          },
          currentUserId
        );
        
        if (commentResponse.success) {
          console.log('Comment created successfully:', commentResponse.data);
          // 새로운 댓글을 추가하고 댓글 목록 전체 갱신
          await fetchComments();
          setNewComment('');
        } else {
          console.error('Failed to create comment:', commentResponse.error);
        }
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };
  
  // 경고 모달에서 '등록하기' 버튼 클릭 시
  const handleConfirmPost = async () => {
    try {
      const commentResponse = await boardApi.createComment(
        {
          ...pendingCommentData,
          emotion_score: pendingEmotionScore
        },
        currentUserId
      );
      
      if (commentResponse.success) {
        console.log('Comment created successfully:', commentResponse.data);
        // 새 댓글을 추가하고 다시 댓글 목록을 갱신
        await fetchComments();
        setNewComment('');
      } else {
        console.error('Failed to create comment:', commentResponse.error);
      }
      
      // 모달 닫기 및 상태 초기화
      setShowWarning(false);
      setPendingCommentData(null);
      setPendingEmotionScore(null);
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };
  
  // 경고 모달에서 '수정하기' 버튼 클릭 시
  const handleCancelPost = () => {
    setShowWarning(false);
    // 수정을 위해 입력 필드는 그대로 유지
  };
  
  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim()) return;
    
    try {
      // 감정 분석
      const emotionResponse = await emotionApi.analyzeEmotion(replyContent);
      
      if (emotionResponse.success) {
        const emotionScore = emotionResponse.data.score;
        
        // 부정적인 감정이 감지되면 (점수가 0.3 이하)
        if (emotionScore <= 0.3) {
          // 경고 모달 표시를 위한 데이터 저장
          setPendingCommentData({
            post_id: postId,
            parent_id: parentId,
            content: replyContent
          });
          setPendingEmotionScore(emotionScore);
          setShowWarning(true);
          return;
        }
        
        // 대댓글 작성
        const replyResponse = await boardApi.createComment(
          {
            post_id: postId,
            parent_id: parentId,
            content: replyContent,
            emotion_score: emotionScore
          },
          currentUserId
        );
        
        if (replyResponse.success) {
          console.log('Reply created successfully:', replyResponse.data);
          // 새로운 댓글을 추가하고 댓글 목록 전체 갱신
          await fetchComments();
          setReplyContent('');
          setReplyingTo(null);
        } else {
          console.error('Failed to create reply:', replyResponse.error);
        }
      }
    } catch (err) {
      console.error('대댓글 작성 실패:', err);
    }
  };
  
  // 댓글과 대댓글을 구조화
  const organizedComments = () => {
    const parents = comments.filter(c => !c.parent_id);
    const children = comments.filter(c => c.parent_id);
    
    return parents.map(parent => ({
      ...parent,
      replies: children.filter(child => child.parent_id === parent.id)
    }));
  };
  
  if (loading) return <CommentSectionContainer>댓글을 불러오는 중...</CommentSectionContainer>;
  if (error) return <CommentSectionContainer>오류: {error}</CommentSectionContainer>;
  
  const commentStructure = organizedComments();
  
  return (
    <CommentSectionContainer>
      {showWarning && (
        <WarningModal
          onCancel={handleCancelPost}
          onConfirm={handleConfirmPost}
          violationType={violationType}
        />
      )}
      
      <CommentHeader>댓글 {comments.length}개</CommentHeader>
      
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput 
          placeholder="댓글을 작성하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SubmitButton type="submit" disabled={!newComment.trim()}>
          댓글 작성
        </SubmitButton>
      </CommentForm>
      
      <CommentList>
        {commentStructure.map(comment => (
          <React.Fragment key={comment.id}>
            <CommentItem>
              <CommentAuthor>
                <AuthorAvatar>
                  {typeof comment.author === 'object' 
                    ? comment.author.name.charAt(0) 
                    : comment.author.charAt(0)}
                </AuthorAvatar>
                <div>
                  <AuthorName>
                    {typeof comment.author === 'object' ? comment.author.name : comment.author}
                  </AuthorName>
                  <CommentDate>{comment.created_at}</CommentDate>
                </div>
                {comment.emotion_score && (
                  <EmotionIndicator score={comment.emotion_score}>
                    {getEmotionIcon(comment.emotion_score)}
                  </EmotionIndicator>
                )}
              </CommentAuthor>
              
              <CommentContent>{comment.content}</CommentContent>
              
              <CommentActions>
                <CommentAction onClick={() => setReplyingTo(comment.id)}>
                  답글
                </CommentAction>
              </CommentActions>
              
              {replyingTo === comment.id && (
                <ReplyForm>
                  <CommentInput 
                    placeholder="답글을 작성하세요..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <SubmitButton 
                    type="button" 
                    disabled={!replyContent.trim()}
                    onClick={() => handleSubmitReply(comment.id)}
                  >
                    답글 작성
                  </SubmitButton>
                </ReplyForm>
              )}
            </CommentItem>
            
            {/* 대댓글 목록 */}
            {comment.replies && comment.replies.map(reply => (
              <CommentItem key={reply.id} isReply={true}>
                <CommentAuthor>
                  <AuthorAvatar>
                    {typeof reply.author === 'object' 
                      ? reply.author.name.charAt(0) 
                      : reply.author.charAt(0)}
                  </AuthorAvatar>
                  <div>
                    <AuthorName>
                      {typeof reply.author === 'object' ? reply.author.name : reply.author}
                    </AuthorName>
                    <CommentDate>{reply.created_at}</CommentDate>
                  </div>
                  {reply.emotion_score && (
                    <EmotionIndicator score={reply.emotion_score}>
                      {getEmotionIcon(reply.emotion_score)}
                    </EmotionIndicator>
                  )}
                </CommentAuthor>
                
                <CommentContent>{reply.content}</CommentContent>
              </CommentItem>
            ))}
          </React.Fragment>
        ))}
      </CommentList>
    </CommentSectionContainer>
  );
}

export default CommentSection;
