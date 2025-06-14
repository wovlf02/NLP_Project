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
    const [violationType, setViolationType] = useState('');
    const [emotionScore, setEmotionScore] = useState(0);

    const categories = [
        '일상', '취미', '고민', '정보', '유머', '질문', '기술', '감정 공유'
    ];

    // violationType에 따른 메시지 매핑
    const getViolationMessage = (type) => {
        const messageMap = {
            'hate': '혐오 표현이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.',
            'harassment': '괴롭힘이나 공격적인 표현이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.',
            'violence': '폭력적인 내용이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.',
            'sexual': '성적인 내용이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.',
            'self-harm': '자해 관련 내용이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.',
            'spam': '스팸성 내용이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.',
            'general': '부적절한 표현이 포함되어 있어 커뮤니티 가이드라인에 위배되었습니다.'
        };
        return messageMap[type] || '커뮤니티 가이드라인에 위배되는 내용이 포함되어 있습니다.';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    // handleSubmit 함수 내 감정 분석 결과 처리 부분 수정
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postData.title.trim() || !postData.content.trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 1. 감정 분석(가이드라인 위배 여부 확인)
            const emotionResponse = await emotionApi.analyzeEmotion(
                `${postData.title}\n${postData.content}`
            );

            // emotionResponse 예시: { violated: true/false, reason: "..." }
            if (emotionResponse.success && emotionResponse.data) {
                const { violationType: vType, score } = emotionResponse.data;

                // violationType이 존재할 경우 모달 표시 (점수 무관)
                if (vType) {
                    setPendingPostData({ ...postData });
                    setViolationType(vType);
                    setEmotionScore(score);
                    setShowWarning(true);
                    setLoading(false);
                    return;
                }

                // 위배가 아니면 바로 게시글 작성
                const response = await boardApi.createPost(
                    postData,
                    1 // 임시 사용자 ID
                );

                if (response.success) {
                    navigate(`/board/${response.data.id}`);
                } else {
                    setError(response.error || '게시글 작성에 실패했습니다.');
                }
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
                pendingPostData,
                1 // 임시 사용자 ID
            );

            if (response.success) {
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
        setViolationType('');
        setEmotionScore(0);
        // 폼은 그대로 유지
    };

    return (
        <CreatePostContainer>
            {showWarning && (
                <WarningModal
                    score={emotionScore}
                    violationType={violationType}
                    onCancel={handleCancelPost}
                    onConfirm={handleConfirmPost}
                >
                    <div>
                        <strong>커뮤니티 가이드라인 위배</strong>
                        <br />
                        <p>{getViolationMessage(violationType)}</p>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>
                            위험도 점수: {(emotionScore * 100).toFixed(1)}%
                        </p>
                        <br />
                        그래도 게시글을 등록하시겠습니까?
                    </div>
                </WarningModal>
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