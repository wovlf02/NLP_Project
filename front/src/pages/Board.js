import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// 게시판 컴포넌트들은 나중에 분리할 예정입니다
import PostCard from '../components/Board/PostCard';
import EmotionAnalysisModal from '../components/Board/EmotionAnalysisModal';

// Mock API 임포트
import { boardApi, emotionApi } from '../api/mockApi';

const BoardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BoardTitle = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const CreatePostButton = styled(Link)`
  background-color: #4a90e2;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3a7bc8;
  }
`;

const BoardCategories = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? '#4a90e2' : '#f1f3f5'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#3a7bc8' : '#e9ecef'};
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// 이제 mockPosts 데이터는 API를 통해 가져올 것이므로 여기서 선언하지 않습니다.

// 카테고리 목록
const categories = [
  '전체', '일상', '취미', '고민', '정보', '유머', '질문', '기술', '감정 공유'
];

function Board() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '일상' });
  const [currentUserId, setCurrentUserId] = useState(1); // 임시 사용자 ID
  
  // 게시글 데이터 로드 (Mock API 호출)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await boardApi.getPosts(activeCategory !== '전체' ? activeCategory : null);
        if (response.success) {
          setPosts(response.data);
        } else {
          console.error('게시글 로드 실패:', response.error);
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error);
      }
    };
    
    fetchPosts();
  }, [activeCategory]);  // 카테고리가 변경될 때마다 게시글 다시 로드

  // 카테고리 변경 처리
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // API 호출은 useEffect에서 처리됨
  };

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>커뮤니티 게시판</BoardTitle>
        <CreatePostButton to="/board/new">게시글 작성</CreatePostButton>
      </BoardHeader>

      <BoardCategories>
        {categories.map(category => (
          <CategoryButton 
            key={category}
            active={activeCategory === category}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </BoardCategories>

      <PostList>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </PostList>

      {/* 감정 분석 모달 */}
      {showEmotionModal && (
        <EmotionAnalysisModal 
          text={newPost.content}
          onClose={() => setShowEmotionModal(false)}
          onConfirm={async () => {
            // 게시글 작성 처리
            try {
              // 감정 분석 점수 가져오기
              const emotionResponse = await emotionApi.analyzeEmotion(newPost.content);
              
              if (emotionResponse.success) {
                // 게시글 생성 API 호출
                const postResponse = await boardApi.createPost(
                  {
                    ...newPost,
                    emotion_score: emotionResponse.data.score
                  },
                  currentUserId
                );
                
                if (postResponse.success) {
                  // 게시글 목록 업데이트
                  setPosts([postResponse.data, ...posts]);
                  setNewPost({ title: '', content: '', category: '일상' });
                  setShowEmotionModal(false);
                  
                  // 감정 기록 저장
                  await emotionApi.saveEmotionRecord(
                    { score: emotionResponse.data.score, context: '게시글 작성' },
                    currentUserId
                  );
                }
              }
            } catch (error) {
              console.error('게시글 작성 실패:', error);
            }
          }}
        />
      )}
    </BoardContainer>
  );
}

export default Board;
