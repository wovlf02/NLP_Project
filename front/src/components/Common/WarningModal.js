import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WarningIcon = styled.div`
  font-size: 2rem;
  color: #f44336;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
  margin: 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f1f3f5;
  color: #495057;
  border: 1px solid #ced4da;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #f44336;
  color: white;
  border: none;
  
  &:hover {
    background-color: #e53935;
  }
`;

function WarningModal({ onCancel, onConfirm, violationType = 'general' }) {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <WarningIcon>⚠️</WarningIcon>
          <ModalTitle>감정 분석 경고</ModalTitle>
        </ModalHeader>
        
        <ModalMessage>
          작성한 글이 다음과 같은 <strong>커뮤니티 가이드라인</strong>에 위배될 수 있습니다:
          <br /><br />
          <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
            {violationType === 'insult' && (
              <>
                <li><strong>심한 욕설이 포함되어 있습니다.</strong></li>
                <li>욕설이나 지나치게 공격적인 표현은 다른 사용자에게 상처를 줄 수 있습니다.</li>
                <li>서로를 존중하는 언어를 사용해 주세요.</li>
              </>
            )}
            
            {violationType === 'defamation' && (
              <>
                <li><strong>상대방을 비방하는 내용이 포함되어 있습니다.</strong></li>
                <li>다른 사용자나 집단에 대한 사실이 아닌 비난이나 옷상을 신중하게 다루어 주세요.</li>
                <li>건전한 비판과 비방은 다릅니다. 건설적인 비판을 통해 소통해 주세요.</li>
              </>
            )}
            
            {violationType === 'mockery' && (
              <>
                <li><strong>상대방을 조롱하는듯한 표현이 있습니다.</strong></li>
                <li>다른 사용자의 상황이나 성격, 외모를 조롱하는 표현은 모두에게 안전한 환경을 해치는 행동입니다.</li>
                <li>상대방의 입장을 이해하고 존중하는 문화를 만들어 주세요.</li>
              </>
            )}
            
            {violationType === 'sexual' && (
              <>
                <li><strong>성적수치심이 드는 표현이 포함되어 있습니다.</strong></li>
                <li>성적인 내용이나 성적 희역이 되는 표현은 다른 사용자에게 불편함을 줄 수 있습니다.</li>
                <li>모든 사용자가 편안하게 이용할 수 있는 환경을 유지해 주세요.</li>
              </>
            )}
            
            {violationType === 'hate' && (
              <>
                <li><strong>특정 집단을 향한 혐오 표현이 포함되어 있습니다.</strong></li>
                <li>성별, 연령, 인종, 종교, 장애, 성적 지향성 등을 이유로 특정 집단을 차별하는 표현은 금지됩니다.</li>
                <li>다양성을 존중하고 모든 사용자를 동등하게 대우하는 문화를 조성해 주세요.</li>
              </>
            )}
            
            {violationType === 'general' && (
              <>
                <li><strong>부정적이거나 적대적인 표현이 감지되었습니다.</strong></li>
                <li>지나치게 부정적이거나 상대에게 상처를 줄 수 있는 내용은 자제해 주세요.</li>
                <li>공감과 배려를 바탕으로 한 표현을 사용해 주세요.</li>
              </>
            )}
          </ul>
          <br />
          이러한 내용은 신고 대상이 될 수 있으며, 다른 사용자들에게도 부정적인 영향을 줄 수 있습니다.
          <br /><br />
          수정하시겠습니까, 아니면 그래도 등록하시겠습니까?
        </ModalMessage>
        
        <ModalActions>
          <CancelButton onClick={onCancel}>수정하기</CancelButton>
          <ConfirmButton onClick={onConfirm}>등록하기</ConfirmButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
}

export default WarningModal;
