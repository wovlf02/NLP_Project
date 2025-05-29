import React from 'react';
import styled from 'styled-components';

const ChatListWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChatListHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const ChatListTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  color: #333;
`;

const ChatRoomsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatRoomItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f1f3f5;
  cursor: pointer;
  background-color: ${props => props.selected ? '#f0f7ff' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.selected ? '#f0f7ff' : '#f8f9fa'};
  }
`;

const ChatRoomName = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: #333;
`;

const LastMessage = styled.p`
  font-size: 0.85rem;
  margin: 0;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 230px;
`;

const ChatRoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const TimeStamp = styled.span`
  font-size: 0.75rem;
  color: #adb5bd;
`;

const UnreadBadge = styled.span`
  background-color: #4a90e2;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  min-width: 8px;
  text-align: center;
`;

const NewChatButton = styled.button`
  margin: 1rem;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

function ChatList({ chatRooms, selectedRoom, onSelectRoom }) {
  return (
    <ChatListWrapper>
      <ChatListHeader>
        <ChatListTitle>채팅</ChatListTitle>
      </ChatListHeader>
      
      <ChatRoomsList>
        {chatRooms.map(room => (
          <ChatRoomItem 
            key={room.id}
            selected={selectedRoom === room.id}
            onClick={() => onSelectRoom(room.id)}
          >
            <ChatRoomName>{room.name}</ChatRoomName>
            <LastMessage>{room.lastMessage}</LastMessage>
            <ChatRoomInfo>
              <TimeStamp>{room.timestamp}</TimeStamp>
              {room.unreadCount > 0 && (
                <UnreadBadge>{room.unreadCount}</UnreadBadge>
              )}
            </ChatRoomInfo>
          </ChatRoomItem>
        ))}
      </ChatRoomsList>
      
      <NewChatButton>새 채팅방 만들기</NewChatButton>
    </ChatListWrapper>
  );
}

export default ChatList;
