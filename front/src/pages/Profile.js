import React, { useState } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
  color: #495057;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #6c757d;
  font-size: 0.9rem;
`;

const EditButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
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

const TabContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SaveButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const EmotionHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmotionCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmotionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmotionIcon = styled.div`
  font-size: 1.5rem;
`;

const EmotionText = styled.div`
  font-weight: 500;
  color: ${props => {
    if (props.score >= 0.7) return '#2e7d32'; // 긍정
    if (props.score <= 0.3) return '#c62828'; // 부정
    return '#616161'; // 중립
  }};
`;

const EmotionDate = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
`;

function Profile({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '테스트 사용자',
    email: 'user@example.com',
    bio: '안녕하세요! 감성 커뮤니티에서 다양한 사람들과 소통하고 싶습니다.',
  });
  
  // 임시 감정 데이터
  const emotionHistory = [
    { id: 1, score: 0.8, date: '2025-05-29', context: '게시글 작성' },
    { id: 2, score: 0.3, date: '2025-05-28', context: '채팅 메시지' },
    { id: 3, score: 0.6, date: '2025-05-27', context: '댓글 작성' },
    { id: 4, score: 0.9, date: '2025-05-26', context: '게시글 작성' },
    { id: 5, score: 0.2, date: '2025-05-25', context: '채팅 메시지' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSaveProfile = () => {
    // 실제 구현에서는 API 호출
    // axios.put('/api/profile', profileData)
    //   .then(response => {
    //     setEditMode(false);
    //   })
    //   .catch(error => console.error('프로필 업데이트 실패:', error));
    
    // 임시 처리
    setEditMode(false);
  };

  const getEmotionIcon = (score) => {
    if (score >= 0.7) return '😊'; // 긍정
    if (score <= 0.3) return '😔'; // 부정
    return '😐'; // 중립
  };

  const getEmotionText = (score) => {
    if (score >= 0.7) return '긍정적';
    if (score <= 0.3) return '부정적';
    return '중립적';
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>{profileData.name.charAt(0)}</Avatar>
        <ProfileInfo>
          <ProfileName>{profileData.name}</ProfileName>
          <ProfileStats>
            <span>게시글: 12</span>
            <span>댓글: 38</span>
            <span>친구: 5</span>
          </ProfileStats>
        </ProfileInfo>
        <EditButton onClick={() => setEditMode(!editMode)}>
          {editMode ? '취소' : '프로필 수정'}
        </EditButton>
      </ProfileHeader>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          프로필 정보
        </Tab>
        <Tab 
          active={activeTab === 'emotions'} 
          onClick={() => setActiveTab('emotions')}
        >
          감정 분석 기록
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          설정
        </Tab>
      </TabContainer>
      
      {activeTab === 'profile' && (
        <TabContent>
          {editMode ? (
            <>
              <FormGroup>
                <Label>이름</Label>
                <Input 
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>이메일</Label>
                <Input 
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>자기소개</Label>
                <TextArea 
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <SaveButton onClick={handleSaveProfile}>저장</SaveButton>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>이름</Label>
                <p>{profileData.name}</p>
              </FormGroup>
              <FormGroup>
                <Label>이메일</Label>
                <p>{profileData.email}</p>
              </FormGroup>
              <FormGroup>
                <Label>자기소개</Label>
                <p>{profileData.bio}</p>
              </FormGroup>
            </>
          )}
        </TabContent>
      )}
      
      {activeTab === 'emotions' && (
        <TabContent>
          <h2>나의 감정 표현 기록</h2>
          <p>최근 활동에서 분석된 감정 표현을 확인할 수 있습니다.</p>
          
          <EmotionHistory>
            {emotionHistory.map(item => (
              <EmotionCard key={item.id}>
                <EmotionInfo>
                  <EmotionIcon>{getEmotionIcon(item.score)}</EmotionIcon>
                  <div>
                    <EmotionText score={item.score}>{getEmotionText(item.score)} 표현</EmotionText>
                    <div>{item.context}</div>
                  </div>
                </EmotionInfo>
                <EmotionDate>{item.date}</EmotionDate>
              </EmotionCard>
            ))}
          </EmotionHistory>
        </TabContent>
      )}
      
      {activeTab === 'settings' && (
        <TabContent>
          <h2>계정 설정</h2>
          <p>알림, 개인정보 설정 및 기타 옵션을 관리할 수 있습니다.</p>
          
          <FormGroup>
            <Label>
              <input type="checkbox" /> 새 메시지 알림 받기
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              <input type="checkbox" /> 친구 요청 알림 받기
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              <input type="checkbox" checked /> 감정 분석 결과 표시
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              <input type="checkbox" checked /> 부정적 표현 경고 표시
            </Label>
          </FormGroup>
        </TabContent>
      )}
    </ProfileContainer>
  );
}

export default Profile;
