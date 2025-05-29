import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AiOutlineEye, AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PostTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const PostContent = styled.p`
  color: #666;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #888;
`;

const PostInfo = styled.div`
  display: flex;
  gap: 1rem;
`;

const PostStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const EmotionIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function getEmotionIcon(score) {
  if (score >= 0.7) return '😊'; // 긍정
  if (score <= 0.3) return '😔'; // 부정
  return '😐'; // 중립
}

function getEmotionText(score) {
  if (score >= 0.7) return '긍정';
  if (score <= 0.3) return '부정';
  return '중립';
}

function PostCard({ post }) {
  return (
    <StyledLink to={`/board/${post.id}`}>
      <Card>
        <PostTitle>{post.title}</PostTitle>
        <PostContent>{post.content}</PostContent>
        <PostMeta>
          <PostInfo>
            <span>{typeof post.author === 'object' ? post.author.name : post.author}</span>
            <span>{post.created_at}</span>
          </PostInfo>
          <PostStats>
            <span><AiOutlineEye style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {post.views}</span>
            <span><AiOutlineHeart style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {post.likes}</span>
            <span><AiOutlineComment style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {post.comments_count}</span>
            <EmotionIndicator score={post.emotion_score}>
              {getEmotionIcon(post.emotion_score)} {getEmotionText(post.emotion_score)}
            </EmotionIndicator>
          </PostStats>
        </PostMeta>
      </Card>
    </StyledLink>
  );
}

export default PostCard;
