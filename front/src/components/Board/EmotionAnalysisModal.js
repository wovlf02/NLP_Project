import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const EmotionResult = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  background-color: ${props => {
    if (props.score >= 0.7) return '#e8f5e9'; // 긍정
    if (props.score <= 0.3) return '#ffebee'; // 부정
    return '#f5f5f5'; // 중립
  }};
`;

const EmotionIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmotionText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => {
    if (props.score >= 0.7) return '#2e7d32'; // 긍정
    if (props.score <= 0.3) return '#c62828'; // 부정
    return '#616161'; // 중립
  }};
`;

const EmotionDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const WarningMessage = styled.div`
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e9ecef;
  color: #495057;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: ${props => props.warning ? '#ff9800' : '#4a90e2'};
  color: white;
  
  &:hover {
    background-color: ${props => props.warning ? '#f57c00' : '#3a7bc8'};
  }
`;

function EmotionAnalysisModal({ text, onClose, onConfirm }) {
  const [emotion, setEmotion] = useState({
    score: 0.5,
    loading: true,
    error: null
  });

  // 감정 분석 API 호출 (실제로는 백엔드로 요청)
  useEffect(() => {
    if (!text) {
      setEmotion({
        score: 0.5,
        loading: false,
        error: '분석할 텍스트가 없습니다.'
      });
      return;
    }

    // 실제 구현에서는 API 호출
    // axios.post('/api/analyze-emotion', { text })
    //   .then(response => setEmotion({ score: response.data.score, loading: false, error: null }))
    //   .catch(error => setEmotion({ score: 0.5, loading: false, error: '감정 분석 중 오류가 발생했습니다.' }));
    
    // 임시 로직: 텍스트에 특정 단어가 포함되어 있는지에 따라 점수 결정
    const negativeWords = ['화나', '짜증', '불만', '싫어', '못해', '안돼', '화가'];
    const positiveWords = ['좋아', '행복', '감사', '즐거', '재미', '좋은', '최고'];
    
    let score = 0.5; // 기본값은 중립
    
    // 부정적 단어 검사
    if (negativeWords.some(word => text.includes(word))) {
      score = 0.2; // 부정적 감정
    }
    
    // 긍정적 단어 검사
    if (positiveWords.some(word => text.includes(word))) {
      score = 0.8; // 긍정적 감정
    }
    
    // 로딩 효과를 위한 타임아웃
    setTimeout(() => {
      setEmotion({
        score,
        loading: false,
        error: null
      });
    }, 1000);
  }, [text]);

  const getEmotionIcon = (score) => {
    if (score >= 0.7) return '😊'; // 긍정
    if (score <= 0.3) return '😔'; // 부정
    return '😐'; // 중립
  };

  const getEmotionText = (score) => {
    if (score >= 0.7) return '긍정적인 감정';
    if (score <= 0.3) return '부정적인 감정';
    return '중립적인 감정';
  };

  const getEmotionDescription = (score) => {
    if (score >= 0.7) {
      return '작성하신 내용에서 긍정적인 감정이 감지되었습니다. 이런 긍정적인 소통이 커뮤니티를 더 활기차게 만듭니다.';
    }
    if (score <= 0.3) {
      return '작성하신 내용에서 부정적인 감정이 감지되었습니다. 부정적인 표현은 상대방에게 불쾌감을 줄 수 있습니다.';
    }
    return '작성하신 내용은 중립적인 감정을 담고 있습니다.';
  };

  const isNegative = emotion.score <= 0.3;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>감정 분석 결과</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {emotion.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>텍스트를 분석 중입니다...</p>
          </div>
        ) : emotion.error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: '1rem' }}>
            <p>{emotion.error}</p>
          </div>
        ) : (
          <>
            <EmotionResult score={emotion.score}>
              <EmotionIcon>{getEmotionIcon(emotion.score)}</EmotionIcon>
              <EmotionText score={emotion.score}>{getEmotionText(emotion.score)}</EmotionText>
              <EmotionDescription>{getEmotionDescription(emotion.score)}</EmotionDescription>
            </EmotionResult>

            {isNegative && (
              <WarningMessage>
                <p><strong>주의:</strong> 작성하신 내용에 부정적인 표현이 감지되었습니다. 이러한 표현은 커뮤니티 가이드라인에 위배될 수 있으며, 다른 사용자에게 불쾌감을 줄 수 있습니다.</p>
              </WarningMessage>
            )}

            <ButtonGroup>
              <CancelButton onClick={onClose}>취소</CancelButton>
              <ConfirmButton 
                warning={isNegative}
                onClick={onConfirm}
              >
                {isNegative ? '그래도 게시하기' : '게시하기'}
              </ConfirmButton>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default EmotionAnalysisModal;
