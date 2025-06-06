import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FriendsPageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#4a90e2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#3a7bc8' : '#f1f3f5'};
  }
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FriendItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
`;

const FriendInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #495057;
`;

const FriendName = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: #333;
`;

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.status === 'online' ? '#40c057' : '#adb5bd'};
  margin-right: 0.5rem;
`;

const FriendStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #6c757d;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background-color: #4a90e2;
  color: white;
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #e9ecef;
  color: #495057;
`;

const DangerButton = styled(ActionButton)`
  background-color: #fa5252;
  color: white;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #6c757d;
`;

// 임시 친구 데이터
const mockFriends = [
  { id: 1, name: '김지연', status: 'online', avatarText: '김' },
  { id: 2, name: '이우진', status: 'offline', avatarText: '이' },
  { id: 3, name: '박민호', status: 'online', avatarText: '박' },
  { id: 4, name: '정수아', status: 'offline', avatarText: '정' },
];

// 임시 친구 요청 데이터
const mockFriendRequests = [
  { id: 5, name: '최영희', status: 'pending', avatarText: '최' },
  { id: 6, name: '한성민', status: 'pending', avatarText: '한' },
];

// 임시 차단 목록 데이터
const mockBlockedUsers = [
  { id: 7, name: '이태석', status: 'blocked', avatarText: '이' },
];

function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    // 실제 구현에서는 API 호출
    // axios.get('/api/friends')
    //   .then(response => setFriends(response.data))
    //   .catch(error => console.error('친구 목록 로드 실패:', error));
    
    // 임시 데이터 사용
    setFriends(mockFriends);
    setFriendRequests(mockFriendRequests);
    setBlockedUsers(mockBlockedUsers);
  }, []);

  // 친구 삭제 처리
  const handleRemoveFriend = (friendId) => {
    // 실제 구현에서는 API 호출
    // axios.delete(`/api/friends/${friendId}`)
    
    // 임시 처리
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  // 친구 차단 처리
  const handleBlockFriend = (friendId) => {
    // 실제 구현에서는 API 호출
    // axios.post('/api/blocked-users', { userId: friendId })
    
    // 임시 처리
    const friendToBlock = friends.find(friend => friend.id === friendId);
    if (friendToBlock) {
      setFriends(friends.filter(friend => friend.id !== friendId));
      setBlockedUsers([...blockedUsers, { ...friendToBlock, status: 'blocked' }]);
    }
  };

  // 친구 요청 수락 처리
  const handleAcceptRequest = (requestId) => {
    // 실제 구현에서는 API 호출
    // axios.post(`/api/friend-requests/${requestId}/accept`)
    
    // 임시 처리
    const requestToAccept = friendRequests.find(req => req.id === requestId);
    if (requestToAccept) {
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
      setFriends([...friends, { ...requestToAccept, status: 'online' }]);
    }
  };

  // 친구 요청 거절 처리
  const handleRejectRequest = (requestId) => {
    // 실제 구현에서는 API 호출
    // axios.post(`/api/friend-requests/${requestId}/reject`)
    
    // 임시 처리
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  // 차단 해제 처리
  const handleUnblockUser = (userId) => {
    // 실제 구현에서는 API 호출
    // axios.delete(`/api/blocked-users/${userId}`)
    
    // 임시 처리
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
  };

  // 검색 처리
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어로 필터링된 목록
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredRequests = friendRequests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredBlocked = blockedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 친구 채팅 시작
  const handleStartChat = (friendId) => {
    // 실제 구현에서는 채팅 페이지로 이동
    console.log(`${friendId}와 채팅 시작`);
    // history.push(`/chat/new?friendId=${friendId}`);
  };

  return (
    <FriendsPageContainer>
      <PageTitle>친구</PageTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'friends'} 
          onClick={() => setActiveTab('friends')}
        >
          친구 목록
        </Tab>
        <Tab 
          active={activeTab === 'requests'} 
          onClick={() => setActiveTab('requests')}
        >
          친구 요청 {friendRequests.length > 0 && `(${friendRequests.length})`}
        </Tab>
        <Tab 
          active={activeTab === 'blocked'} 
          onClick={() => setActiveTab('blocked')}
        >
          차단 목록
        </Tab>
      </TabContainer>
      
      <SearchContainer>
        <SearchInput 
          type="text"
          placeholder="이름으로 검색..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchContainer>
      
      {activeTab === 'friends' && (
        <FriendsList>
          {filteredFriends.length > 0 ? (
            filteredFriends.map(friend => (
              <FriendItem key={friend.id}>
                <FriendInfo>
                  <Avatar>{friend.avatarText}</Avatar>
                  <div>
                    <FriendName>{friend.name}</FriendName>
                    <FriendStatus>
                      <StatusIndicator status={friend.status} />
                      {friend.status === 'online' ? '온라인' : '오프라인'}
                    </FriendStatus>
                  </div>
                </FriendInfo>
                <ButtonGroup>
                  <PrimaryButton onClick={() => handleStartChat(friend.id)}>
                    채팅
                  </PrimaryButton>
                  <SecondaryButton onClick={() => handleRemoveFriend(friend.id)}>
                    삭제
                  </SecondaryButton>
                  <DangerButton onClick={() => handleBlockFriend(friend.id)}>
                    차단
                  </DangerButton>
                </ButtonGroup>
              </FriendItem>
            ))
          ) : (
            <EmptyState>
              {searchTerm ? '검색 결과가 없습니다.' : '친구 목록이 비어있습니다.'}
            </EmptyState>
          )}
        </FriendsList>
      )}
      
      {activeTab === 'requests' && (
        <FriendsList>
          {filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <FriendItem key={request.id}>
                <FriendInfo>
                  <Avatar>{request.avatarText}</Avatar>
                  <FriendName>{request.name}</FriendName>
                </FriendInfo>
                <ButtonGroup>
                  <PrimaryButton onClick={() => handleAcceptRequest(request.id)}>
                    수락
                  </PrimaryButton>
                  <SecondaryButton onClick={() => handleRejectRequest(request.id)}>
                    거절
                  </SecondaryButton>
                </ButtonGroup>
              </FriendItem>
            ))
          ) : (
            <EmptyState>
              {searchTerm ? '검색 결과가 없습니다.' : '친구 요청이 없습니다.'}
            </EmptyState>
          )}
        </FriendsList>
      )}
      
      {activeTab === 'blocked' && (
        <FriendsList>
          {filteredBlocked.length > 0 ? (
            filteredBlocked.map(user => (
              <FriendItem key={user.id}>
                <FriendInfo>
                  <Avatar>{user.avatarText}</Avatar>
                  <FriendName>{user.name}</FriendName>
                </FriendInfo>
                <ButtonGroup>
                  <SecondaryButton onClick={() => handleUnblockUser(user.id)}>
                    차단 해제
                  </SecondaryButton>
                </ButtonGroup>
              </FriendItem>
            ))
          ) : (
            <EmptyState>
              {searchTerm ? '검색 결과가 없습니다.' : '차단 목록이 비어있습니다.'}
            </EmptyState>
          )}
        </FriendsList>
      )}
    </FriendsPageContainer>
  );
}

export default FriendsPage;
