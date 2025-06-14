import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import styled from 'styled-components';
import {boardApi, emotionApi} from '../api/mockApi';
import CommentSection from '../components/Board/CommentSection';
// 아이콘 추가
import {AiOutlineEye, AiFillHeart, AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt} from 'react-icons/ai';

const PostDetailContainer = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
`;

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    color: #4a90e2;
    text-decoration: none;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;

    &:hover {
        text-decoration: underline;
    }
`;

const PostHeader = styled.div`
    margin-bottom: 2rem;
`;

const PostTitle = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
`;

const PostMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
    color: #6c757d;
    font-size: 0.9rem;
`;

const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

const PostContent = styled.div`
    margin: 2rem 0;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
`;

const ActionsBar = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
    padding: 1rem 0;
    border-top: 1px solid #e9ecef;
    border-bottom: 1px solid #e9ecef;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #495057;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;

    &:hover {
        background-color: #f8f9fa;
    }
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

function PostDetail() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await boardApi.getPostById(postId);

                if (response.success) {
                    setPost(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('게시글을 불러오는 중 오류가 발생했습니다.');
                console.error('게시글 조회 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleLike = () => {
        // 실제 구현에서는 API 호출로 좋아요 처리
        if (!liked) {
            setPost(prev => ({...prev, likes: prev.likes + 1}));
            setLiked(true);
        } else {
            setPost(prev => ({...prev, likes: prev.likes - 1}));
            setLiked(false);
        }
    };

    if (loading) return <PostDetailContainer>게시글을 불러오는 중...</PostDetailContainer>;
    if (error) return <PostDetailContainer>오류: {error}</PostDetailContainer>;
    if (!post) return <PostDetailContainer>게시글을 찾을 수 없습니다.</PostDetailContainer>;

    return (
        <PostDetailContainer>
            <BackButton to="/board">← 게시판으로 돌아가기</BackButton>

            <PostHeader>
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                    <AuthorInfo>
                        <AuthorAvatar>
                            {typeof post.author === 'object'
                                ? post.author.name.charAt(0)
                                : post.author.charAt(0)}
                        </AuthorAvatar>
                        <div>
                            <div>
                                {typeof post.author === 'object' ? post.author.name : post.author}
                            </div>
                            <div>{post.created_at}</div>
                        </div>
                    </AuthorInfo>
                    <PostStats>
                        <span><AiOutlineEye style={{verticalAlign: 'middle', marginRight: '4px'}}/> {post.views}</span>
                        <span>{liked ?
                            <AiFillHeart style={{verticalAlign: 'middle', marginRight: '4px', color: '#e53935'}}/> :
                            <AiOutlineHeart style={{verticalAlign: 'middle', marginRight: '4px'}}/>} {post.likes}</span>
                        <span><AiOutlineComment
                            style={{verticalAlign: 'middle', marginRight: '4px'}}/> {post.comments_count}</span>
                        <EmotionIndicator score={post.emotion_score}>
                            {getEmotionIcon(post.emotion_score)} {getEmotionText(post.emotion_score)}
                        </EmotionIndicator>
                    </PostStats>
                </PostMeta>
            </PostHeader>

            <PostContent>{post.content}</PostContent>

            <ActionsBar>
                <div>
                    <ActionButton onClick={handleLike}>
                        {liked ? <AiFillHeart style={{color: '#e53935'}}/> : <AiOutlineHeart/>} 좋아요 {post.likes}
                    </ActionButton>
                </div>
                <div>
                    <ActionButton><AiOutlineShareAlt/> 공유</ActionButton>
                </div>
            </ActionsBar>

            <CommentSection
                postId={postId}
                onCommentsChange={(commentCount) => {
                    // 댓글 수가 변경되면 게시글 정보 업데이트
                    if (post) {
                        setPost({...post, comments_count: commentCount});
                    }
                }}
            />
        </PostDetailContainer>
    );
}

export default PostDetail;
