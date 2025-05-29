// 임시 사용자 데이터
export const users = [
  { id: 1, name: '테스트 사용자', email: 'test@example.com', password: 'password' },
  { id: 2, name: '이우진', email: 'woojin@example.com', password: 'password' },
  { id: 3, name: '김지연', email: 'jiyeon@example.com', password: 'password' },
  { id: 4, name: '박민호', email: 'minho@example.com', password: 'password' },
  { id: 5, name: '정수아', email: 'sua@example.com', password: 'password' },
];

// 임시 게시글 데이터
export const posts = [
  {
    id: 1,
    title: '감정 분석 기술에 대한 생각',
    content: '여러분은 감정 분석 기술이 커뮤니티에 어떤 영향을 미칠 것 같나요? 저는 개인적으로 긍정적인 영향이 클 것 같습니다.',
    author: { id: 1, name: '테스트 사용자' },
    created_at: '2025-05-29',
    views: 42,
    likes: 15,
    comments_count: 5,
    emotion_score: 0.8,  // 0~1 사이의 점수, 높을수록 긍정적
    category: '기술'
  },
  {
    id: 2,
    title: '오늘 정말 화가나는 일이 있었어요',
    content: '정말 짜증나고 화가 나서 견딜 수가 없네요. 이런 일이 있을 때 어떻게 해야 할까요?',
    author: { id: 2, name: '이우진' },
    created_at: '2025-05-28',
    views: 38,
    likes: 7,
    comments_count: 12,
    emotion_score: 0.2,  // 부정적인 감정
    category: '고민'
  },
  {
    id: 3,
    title: '주말에 본 영화 추천해요!',
    content: '정말 재미있었습니다. 스토리도 좋고 연기도 훌륭했어요. 강추합니다!',
    author: { id: 3, name: '김지연' },
    created_at: '2025-05-27',
    views: 65,
    likes: 23,
    comments_count: 8,
    emotion_score: 0.9,  // 매우 긍정적
    category: '취미'
  },
  {
    id: 4,
    title: '새로운 취미를 찾고 있어요',
    content: '요즘 새로운 취미를 찾고 있는데 추천해주실 만한 것이 있을까요? 집에서 할 수 있는 것이면 더 좋을 것 같아요.',
    author: { id: 4, name: '박민호' },
    created_at: '2025-05-26',
    views: 29,
    likes: 10,
    comments_count: 15,
    emotion_score: 0.6,  // 중립~긍정
    category: '취미'
  },
  {
    id: 5,
    title: '이 서비스의 감정 분석은 정확한가요?',
    content: '감정 분석 기능이 얼마나 정확한지 궁금합니다. 실제로 제 감정을 잘 파악하는 것 같나요?',
    author: { id: 5, name: '정수아' },
    created_at: '2025-05-25',
    views: 52,
    likes: 18,
    comments_count: 9,
    emotion_score: 0.5,  // 중립
    category: '질문'
  }
];

// 임시 댓글 데이터
export const comments = [
  {
    id: 1,
    post_id: 1,
    author: { id: 2, name: '이우진' },
    content: '감정 분석 기술은 정말 유용한 것 같아요. 특히 커뮤니티에서는 더욱 중요할 것 같습니다.',
    created_at: '2025-05-29T10:15:00',
    likes: 3,
    emotion_score: 0.7
  },
  {
    id: 2,
    post_id: 1,
    author: { id: 3, name: '김지연' },
    content: '저도 동의합니다. 다만 개인정보 보호 측면에서 신중하게 접근해야 할 것 같아요.',
    created_at: '2025-05-29T11:20:00',
    likes: 5,
    emotion_score: 0.5
  },
  {
    id: 3,
    post_id: 2,
    author: { id: 1, name: '테스트 사용자' },
    content: '힘든 일이 있으셨군요. 충분히 쉬시면서 마음의 여유를 가져보세요.',
    created_at: '2025-05-28T15:30:00',
    likes: 7,
    emotion_score: 0.6
  },
  {
    id: 4,
    post_id: 3,
    author: { id: 4, name: '박민호' },
    content: '저도 그 영화 봤는데 정말 최고였어요! 다음에 또 추천해주세요.',
    created_at: '2025-05-27T18:45:00',
    likes: 2,
    emotion_score: 0.9
  }
];

// 임시 채팅방 데이터
export const chatRooms = [
  {
    id: 1,
    name: '일반 채팅방',
    participants: [
      { id: 1, name: '테스트 사용자' },
      { id: 2, name: '이우진' },
      { id: 3, name: '김지연' }
    ],
    lastMessage: '안녕하세요, 오늘 기분이 어떠신가요?',
    lastMessageTime: '2025-05-30T14:32:00',
    unreadCount: 3,
  },
  {
    id: 2,
    name: '기술 토론방',
    participants: [
      { id: 1, name: '테스트 사용자' },
      { id: 4, name: '박민호' }
    ],
    lastMessage: 'NLP 기술은 정말 흥미롭네요',
    lastMessageTime: '2025-05-30T12:15:00',
    unreadCount: 0,
  },
  {
    id: 3,
    name: '취미 공유방',
    participants: [
      { id: 1, name: '테스트 사용자' },
      { id: 3, name: '김지연' },
      { id: 5, name: '정수아' }
    ],
    lastMessage: '저는 요즘 러닝을 시작했어요',
    lastMessageTime: '2025-05-29T18:23:00',
    unreadCount: 5,
  },
  {
    id: 4,
    name: '음악 감상방',
    participants: [
      { id: 1, name: '테스트 사용자' },
      { id: 2, name: '이우진' },
      { id: 4, name: '박민호' }
    ],
    lastMessage: '이 노래 정말 좋네요. 공유해 드립니다',
    lastMessageTime: '2025-05-29T20:45:00',
    unreadCount: 0,
  },
];

// 임시 채팅 메시지 데이터
export const chatMessages = [
  {
    id: 1,
    roomId: 1,
    sender: { id: 2, name: '이우진' },
    text: '안녕하세요, 오늘 기분이 어떠신가요?',
    timestamp: '2025-05-30T14:32:00',
    emotionScore: 0.7,
  },
  {
    id: 2,
    roomId: 1,
    sender: { id: 1, name: '테스트 사용자' },
    text: '안녕하세요! 오늘은 날씨가 좋아서 기분이 좋네요.',
    timestamp: '2025-05-30T14:33:00',
    emotionScore: 0.8,
  },
  {
    id: 3,
    roomId: 1,
    sender: { id: 3, name: '김지연' },
    text: '저는 오늘 조금 피곤하네요... 어제 늦게까지 일했거든요.',
    timestamp: '2025-05-30T14:34:00',
    emotionScore: 0.4,
  },
  {
    id: 4,
    roomId: 1,
    sender: { id: 2, name: '이우진' },
    text: '아, 그러셨군요. 오늘은 일찍 주무시는 게 좋겠네요!',
    timestamp: '2025-05-30T14:35:00',
    emotionScore: 0.6,
  },
];

// 임시 친구 데이터
export const friends = [
  { id: 2, name: '이우진', status: 'online', avatarText: '이' },
  { id: 3, name: '김지연', status: 'offline', avatarText: '김' },
  { id: 4, name: '박민호', status: 'online', avatarText: '박' },
  { id: 5, name: '정수아', status: 'offline', avatarText: '정' },
];

// 임시 친구 요청 데이터
export const friendRequests = [
  { id: 6, name: '최영희', status: 'pending', avatarText: '최' },
  { id: 7, name: '한성민', status: 'pending', avatarText: '한' },
];

// 임시 차단 목록 데이터
export const blockedUsers = [
  { id: 8, name: '이태석', status: 'blocked', avatarText: '이' },
];

// 임시 감정 분석 기록 데이터
export const emotionHistory = [
  { id: 1, userId: 1, score: 0.8, date: '2025-05-29', context: '게시글 작성' },
  { id: 2, userId: 1, score: 0.3, date: '2025-05-28', context: '채팅 메시지' },
  { id: 3, userId: 1, score: 0.6, date: '2025-05-27', context: '댓글 작성' },
  { id: 4, userId: 1, score: 0.9, date: '2025-05-26', context: '게시글 작성' },
  { id: 5, userId: 1, score: 0.2, date: '2025-05-25', context: '채팅 메시지' },
];
