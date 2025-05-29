import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatRoomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatRoomHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomName = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  color: #333;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #adb5bd;
  
  &:hover {
    color: #495057;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  max-width: 70%;
`;

const MessageBubble = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 18px;
  border-bottom-right-radius: ${props => props.isMine ? '4px' : '18px'};
  border-bottom-left-radius: ${props => props.isMine ? '18px' : '4px'};
  background-color: ${props => {
    if (props.isMine) {
      return props.emotionScore <= 0.3 ? '#ffebee' : '#e3f2fd';
    }
    return '#f1f3f5';
  }};
  color: ${props => {
    if (props.isMine && props.emotionScore <= 0.3) {
      return '#c62828';
    }
    return '#333';
  }};
  position: relative;
  word-break: break-word;
`;

const MessageInfo = styled.div`
  display: flex;
  justify-content: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const SenderName = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #495057;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #adb5bd;
`;

const EmotionIndicator = styled.span`
  font-size: 1rem;
  margin-left: 0.25rem;
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SendButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
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

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getEmotionIcon(score) {
  if (score >= 0.7) return '😊'; // 긍정
  if (score <= 0.3) return '😔'; // 부정
  return ''; // 중립은 아이콘 표시 안함
}

function ChatRoom({ room, messages, draftMessage, onMessageChange, onSendMessage }) {
  const messagesEndRef = useRef(null);
  
  // 새 메시지가 추가될 때마다 스크롤 맨 아래로 - 커스텀 스크롤링 구현
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Enter 키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <ChatRoomWrapper>
      <ChatRoomHeader>
        <RoomName>{room.name}</RoomName>
      </ChatRoomHeader>
      
      <MessagesContainer>
        {messages.map(message => {
          const isMine = message.sender.id === 1; // 현재 사용자 ID가 1이라고 가정
          
          return (
            <MessageGroup key={message.id} isMine={isMine}>
              <MessageInfo isMine={isMine}>
                {!isMine && <SenderName>{message.sender.name}</SenderName>}
                <Timestamp>{formatTimestamp(message.timestamp)}</Timestamp>
              </MessageInfo>
              
              <MessageBubble isMine={isMine} emotionScore={message.emotionScore}>
                {message.text}
                <EmotionIndicator>
                  {getEmotionIcon(message.emotionScore)}
                </EmotionIndicator>
              </MessageBubble>
            </MessageGroup>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <ChatInputContainer>
        <ChatInput 
          type="text"
          placeholder="메시지 입력..."
          value={draftMessage}
          onChange={onMessageChange}
          onKeyDown={handleKeyDown}
        />
        <SendButton 
          onClick={onSendMessage}
          disabled={!draftMessage.trim()}
        >
          ➤
        </SendButton>
      </ChatInputContainer>
    </ChatRoomWrapper>
  );
}

export default ChatRoom;
