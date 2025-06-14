import React, {useState, useEffect} from 'react';
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

function WarningModal({ score, violationType, onClose, onConfirm }) {
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

    const getEmotionIcon = (type) => {
        const iconMap = {
            'hate': '😡',
            'harassment': '😠',
            'violence': '⚠️',
            'sexual': '🚫',
            'self-harm': '😢',
            'spam': '📢',
            'general': '⚠️'
        };
        return iconMap[type] || '⚠️';
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>커뮤니티 가이드라인 위배</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <EmotionResult score={score}>
                    <EmotionIcon>{getEmotionIcon(violationType)}</EmotionIcon>
                    <EmotionText score={score}>위험도: {(score * 100).toFixed(1)}%</EmotionText>
                    <EmotionDescription>{getViolationMessage(violationType)}</EmotionDescription>
                </EmotionResult>
                <WarningMessage>
                    <p>
                        <strong>주의:</strong> 이러한 표현은 다른 사용자에게 불쾌감을 줄 수 있으며, 커뮤니티 분위기를 해칠 수 있습니다.
                    </p>
                </WarningMessage>
                <ButtonGroup>
                    <CancelButton onClick={onClose}>수정하기</CancelButton>
                    <ConfirmButton warning={true} onClick={onConfirm}>
                        그래도 등록하기
                    </ConfirmButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
}

export default WarningModal;