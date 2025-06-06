import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { boardApi, emotionApi } from '../api/mockApi';
import WarningModal from '../components/Common/WarningModal';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const CreatePostContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #4a90e2;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 2rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CreatePostTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  min-height: 300px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
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

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  border-radius: 4px;
`;

function CreatePost() {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: '일상'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 감정 분석 관련 상태
  const [showWarning, setShowWarning] = useState(false);
  const [pendingPostData, setPendingPostData] = useState(null);
  const [pendingEmotionScore, setPendingEmotionScore] = useState(null);
  
  // 카테고리 목록
  const categories = [
    '일상', '취미', '고민', '정보', '유머', '질문', '기술', '감정 공유'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postData.title.trim() || !postData.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 감정 분석 실행
      const emotionResponse = await emotionApi.analyzeEmotion(postData.content);
      
      if (emotionResponse.success) {
        const emotionScore = emotionResponse.data.score;
        
        // 부정적인 감정이 감지되면 (점수가 0.3 이하)
        if (emotionScore <= 0.3) {
          // 경고 모달 표시를 위한 데이터 저장
          setPendingPostData({...postData});
          setPendingEmotionScore(emotionScore);
          setShowWarning(true);
          setLoading(false);
          return;
        }
        
        // 부정적 감정이 없는 경우 바로 게시글 작성
        const response = await boardApi.createPost(
          {
            ...postData,
            emotion_score: emotionScore
          },
          1 // 임시 사용자 ID
        );
        
        if (response.success) {
          // 작성된 게시글 페이지로 이동
          navigate(`/board/${response.data.id}`);
        } else {
          setError(response.error || '게시글 작성에 실패했습니다.');
        }
      } else {
        setError('감정 분석 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('게시글 작성 중 오류가 발생했습니다.');
      console.error('게시글 작성 실패:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 경고 모달에서 '등록하기' 버튼 클릭 시
  const handleConfirmPost = async () => {
    try {
      setLoading(true);
      
      const response = await boardApi.createPost(
        {
          ...pendingPostData,
          emotion_score: pendingEmotionScore
        },
        1 // 임시 사용자 ID
      );
      
      if (response.success) {
        // 모달 닫기 및 작성된 게시글 페이지로 이동
        setShowWarning(false);
        navigate(`/board/${response.data.id}`);
      } else {
        setError(response.error || '게시글 작성에 실패했습니다.');
        setShowWarning(false);
      }
    } catch (err) {
      setError('게시글 작성 중 오류가 발생했습니다.');
      console.error('게시글 작성 실패:', err);
      setShowWarning(false);
    } finally {
      setLoading(false);
    }
  };
  
  // 경고 모달에서 '수정하기' 버튼 클릭 시
  const handleCancelPost = () => {
    setShowWarning(false);
    // 수정을 위해 폼은 그대로 유지
  };
  
  return (
    <CreatePostContainer>
      {showWarning && (
        <WarningModal
          onCancel={handleCancelPost}
          onConfirm={handleConfirmPost}
        />
      )}
      
      <BackButton to="/board">
        <AiOutlineArrowLeft /> 게시판으로 돌아가기
      </BackButton>
      
      <CreatePostTitle>새 게시글 작성</CreatePostTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="category">카테고리</Label>
          <CategorySelect
            id="category"
            name="category"
            value={postData.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </CategorySelect>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="content">내용</Label>
          <TextArea
            id="content"
            name="content"
            value={postData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? '처리 중...' : '게시글 등록'}
        </Button>
      </form>
    </CreatePostContainer>
  );
}

export default CreatePost;
