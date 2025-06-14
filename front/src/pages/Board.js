import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import PostCard from '../components/Board/PostCard';
import EmotionAnalysisModal from '../components/Board/EmotionAnalysisModal';

// ✅ 실제 API 사용
import {boardApi} from '../api/endpoint/boardApi';
import {emotionApi} from '../api/endpoint/emotionApi';

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

const categories = [
    '전체', '일상', '취미', '고민', '정보', '유머', '질문', '기술', '감정 공유'
];

function Board() {
    const [posts, setPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [showEmotionModal, setShowEmotionModal] = useState(false);
    const [newPost, setNewPost] = useState({title: '', content: '', category: '일상'});

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
    }, [activeCategory]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
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
                    <PostCard key={post.id} post={post}/>
                ))}
            </PostList>

            {showEmotionModal && (
                <EmotionAnalysisModal
                    text={newPost.content}
                    onClose={() => setShowEmotionModal(false)}
                    onConfirm={async () => {
                        try {
                            const emotionResponse = await emotionApi.analyzeEmotion(newPost.content);

                            if (emotionResponse.success) {
                                const postResponse = await boardApi.createPost({
                                    ...newPost,
                                    emotion_score: emotionResponse.data.score
                                });

                                if (postResponse.success) {
                                    setPosts([postResponse.data, ...posts]);
                                    setNewPost({title: '', content: '', category: '일상'});
                                    setShowEmotionModal(false);

                                    await emotionApi.saveEmotionRecord(
                                        {score: emotionResponse.data.score, context: '게시글 작성'},
                                        postResponse.data.user_id // 백엔드가 user_id 포함 응답할 경우
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
