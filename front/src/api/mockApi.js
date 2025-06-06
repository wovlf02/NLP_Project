import {
    users, posts, comments, chatRooms,
    chatMessages, friends, friendRequests,
    blockedUsers, emotionHistory
} from './mockData';

// 데이터 복사본 만들기 (원본 데이터 보존)
let _users = [...users];
let _posts = [...posts];
let _comments = [...comments];
let _chatRooms = [...chatRooms];
let _chatMessages = [...chatMessages];
let _friends = [...friends];
let _friendRequests = [...friendRequests];
let _blockedUsers = [...blockedUsers];
let _emotionHistory = [...emotionHistory];

// API 호출 딜레이 시뮬레이션 (ms)
const DELAY = 500;

// 응답 래핑 함수
const response = (data, success = true, error = null) => ({
    success,
    data,
    error
});

// 오류 응답 래핑 함수
const errorResponse = (errorMessage) => ({
    success: false,
    data: null,
    error: errorMessage
});

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 인증 관련 API
export const authApi = {
    // 로그인
    login: async (email, password) => {
        await delay(DELAY);
        const user = _users.find(u => u.email === email && u.password === password);

        if (!user) {
            return response(null, false, '이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        // 비밀번호 필드 제외하고 반환
        const {password: _, ...userWithoutPassword} = user;
        return response(userWithoutPassword);
    },

    // 회원가입
    register: async (userData) => {
        await delay(DELAY);

        // 이메일 중복 확인
        if (_users.some(u => u.email === userData.email)) {
            return response(null, false, '이미 사용 중인 이메일입니다.');
        }

        // 새 사용자 생성
        const newUser = {
            id: _users.length + 1,
            ...userData
        };

        _users.push(newUser);

        // 비밀번호 필드 제외하고 반환
        const {password: _, ...userWithoutPassword} = newUser;
        return response(userWithoutPassword);
    }
};

// 게시판 관련 API
export const boardApi = {
    // 게시글 목록 조회
    getPosts: async (category = null) => {
        await delay(DELAY);
        let filteredPosts = [..._posts];

        if (category) {
            filteredPosts = filteredPosts.filter(post => post.category === category);
        }

        return response(filteredPosts);
    },

    getPostById: async (postId) => {
        await delay(DELAY);
        const post = _posts.find(p => p.id === parseInt(postId));

        if (!post) {
            return errorResponse('게시글을 찾을 수 없습니다.');
        }

        // 조회수 증가
        post.views += 1;

        return response(post);
    },

    // 게시글 상세 조회
    getPost: async (postId) => {
        await delay(DELAY);

        const post = _posts.find(p => p.id === postId);

        if (!post) {
            return response(null, false, '게시글을 찾을 수 없습니다.');
        }

        // 조회수 증가
        const updatedPost = {...post, views: post.views + 1};
        _posts = _posts.map(p => p.id === postId ? updatedPost : p);

        return response(updatedPost);
    },

    // 게시글 작성
    createPost: async (postData, userId) => {
        await delay(DELAY);

        const author = _users.find(u => u.id === userId);

        if (!author) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        const newPost = {
            id: _posts.length + 1,
            ...postData,
            author: {id: author.id, name: author.name},
            created_at: new Date().toISOString().split('T')[0],
            views: 0,
            likes: 0,
            comments_count: 0
        };

        _posts.unshift(newPost);
        return response(newPost);
    },

    // 게시글 수정
    updatePost: async (postId, postData, userId) => {
        await delay(DELAY);

        const post = _posts.find(p => p.id === postId);

        if (!post) {
            return response(null, false, '게시글을 찾을 수 없습니다.');
        }

        if (post.author.id !== userId) {
            return response(null, false, '게시글 수정 권한이 없습니다.');
        }

        const updatedPost = {...post, ...postData};
        _posts = _posts.map(p => p.id === postId ? updatedPost : p);

        return response(updatedPost);
    },

    // 게시글 삭제
    deletePost: async (postId, userId) => {
        await delay(DELAY);

        const post = _posts.find(p => p.id === postId);

        if (!post) {
            return response(null, false, '게시글을 찾을 수 없습니다.');
        }

        if (post.author.id !== userId) {
            return response(null, false, '게시글 삭제 권한이 없습니다.');
        }

        _posts = _posts.filter(p => p.id !== postId);
        return response({success: true});
    },

    // 댓글 목록 조회
    getComments: async (postId) => {
        await delay(DELAY);

        console.log('getComments called with postId:', postId);
        console.log('Available comments:', _comments);

        // postId가 문자열로 넘어올 수 있으므로 숫자로 변환
        const numericPostId = parseInt(postId);
        console.log('Converted postId:', numericPostId);

        // 유효한 값인지 확인
        if (isNaN(numericPostId)) {
            console.error('Invalid postId:', postId);
            return response([], false, '유효하지 않은 게시글 ID');
        }

        // 해당 게시글의 댓글만 필터링
        const postComments = _comments.filter(c => c.post_id === numericPostId);
        console.log('Filtered comments:', postComments);

        return response(postComments);
    },

    // 댓글 작성
    createComment: async (commentData, userId) => {
        await delay(DELAY);

        const post = _posts.find(p => p.id === parseInt(commentData.post_id));
        const user = _users.find(u => u.id === userId);

        if (!post) {
            return response(null, false, '게시글을 찾을 수 없습니다.');
        }

        if (!user) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        const newComment = {
            id: _comments.length + 1,
            post_id: post.id,
            parent_id: commentData.parent_id || null,
            author: {id: user.id, name: user.name},
            content: commentData.content,
            created_at: new Date().toISOString().split('T')[0],
            likes: 0,
            emotion_score: commentData.emotion_score || 0.5
        };

        _comments.push(newComment);

        // 댓글 수 증가
        const postIndex = _posts.findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
            _posts[postIndex].comments_count += 1;
        }

        return response(newComment);
    }
};

// 채팅 관련 API
export const chatApi = {
    // 채팅방 목록 조회
    getChatRooms: async (userId) => {
        await delay(DELAY);

        // 사용자가 참여 중인 채팅방만 필터링
        const userRooms = _chatRooms.filter(room =>
            room.participants.some(p => p.id === userId)
        );

        return response(userRooms);
    },

    // 채팅방 생성
    createChatRoom: async (roomData, userId) => {
        await delay(DELAY);

        const creator = _users.find(u => u.id === userId);

        if (!creator) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        // 참여자 정보 조회
        const participants = roomData.participantIds.map(id => {
            const user = _users.find(u => u.id === id);
            return user ? {id: user.id, name: user.name} : null;
        }).filter(Boolean);

        // 방장도 참여자에 추가
        if (!participants.some(p => p.id === creator.id)) {
            participants.push({id: creator.id, name: creator.name});
        }

        const newRoom = {
            id: _chatRooms.length + 1,
            name: roomData.name,
            participants,
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0
        };

        _chatRooms.push(newRoom);
        return response(newRoom);
    },

    // 메시지 목록 조회
    getMessages: async (roomId) => {
        await delay(DELAY);

        const roomMessages = _chatMessages.filter(msg => msg.roomId === roomId);
        return response(roomMessages);
    },

    // 메시지 전송
    sendMessage: async (messageData, userId) => {
        await delay(DELAY);

        const sender = _users.find(u => u.id === userId);
        const room = _chatRooms.find(r => r.id === messageData.roomId);

        if (!sender) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        if (!room) {
            return response(null, false, '채팅방을 찾을 수 없습니다.');
        }

        // 감정 점수 계산 (임시 로직)
        let emotionScore = 0.5; // 기본값은 중립

        const negativeWords = ['화나', '짜증', '불만', '싫어', '못해', '안돼', '화가'];
        const positiveWords = ['좋아', '행복', '감사', '즐거', '재미', '좋은', '최고'];

        if (negativeWords.some(word => messageData.text.includes(word))) {
            emotionScore = 0.2; // 부정적 감정
        }

        if (positiveWords.some(word => messageData.text.includes(word))) {
            emotionScore = 0.8; // 긍정적 감정
        }

        const newMessage = {
            id: _chatMessages.length + 1,
            roomId: messageData.roomId,
            sender: {id: sender.id, name: sender.name},
            text: messageData.text,
            timestamp: new Date().toISOString(),
            emotionScore
        };

        _chatMessages.push(newMessage);

        // 채팅방 정보 업데이트
        const updatedRoom = {
            ...room,
            lastMessage: messageData.text,
            lastMessageTime: newMessage.timestamp
        };

        _chatRooms = _chatRooms.map(r => r.id === room.id ? updatedRoom : r);

        return response(newMessage);
    }
};

// 친구 관련 API
export const friendsApi = {
    // 친구 목록 조회
    getFriends: async (userId) => {
        await delay(DELAY);
        return response(_friends);
    },

    // 친구 요청 목록 조회
    getFriendRequests: async (userId) => {
        await delay(DELAY);
        return response(_friendRequests);
    },

    // 차단 목록 조회
    getBlockedUsers: async (userId) => {
        await delay(DELAY);
        return response(_blockedUsers);
    },

    // 친구 요청 전송
    sendFriendRequest: async (targetUserId, userId) => {
        await delay(DELAY);

        const sender = _users.find(u => u.id === userId);
        const target = _users.find(u => u.id === targetUserId);

        if (!sender || !target) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        // 이미 친구인지 확인
        if (_friends.some(f => f.id === targetUserId)) {
            return response(null, false, '이미 친구인 사용자입니다.');
        }

        // 이미 요청을 보냈는지 확인
        if (_friendRequests.some(r => r.id === targetUserId)) {
            return response(null, false, '이미 친구 요청을 보낸 사용자입니다.');
        }

        const newRequest = {
            id: target.id,
            name: target.name,
            status: 'pending',
            avatarText: target.name.charAt(0)
        };

        _friendRequests.push(newRequest);
        return response(newRequest);
    },

    // 친구 요청 수락
    acceptFriendRequest: async (requestId, userId) => {
        await delay(DELAY);

        const request = _friendRequests.find(r => r.id === requestId);

        if (!request) {
            return response(null, false, '친구 요청을 찾을 수 없습니다.');
        }

        // 친구 목록에 추가
        const newFriend = {
            ...request,
            status: 'online'
        };

        _friends.push(newFriend);

        // 요청 목록에서 제거
        _friendRequests = _friendRequests.filter(r => r.id !== requestId);

        return response(newFriend);
    },

    // 친구 요청 거절
    rejectFriendRequest: async (requestId, userId) => {
        await delay(DELAY);

        const request = _friendRequests.find(r => r.id === requestId);

        if (!request) {
            return response(null, false, '친구 요청을 찾을 수 없습니다.');
        }

        // 요청 목록에서 제거
        _friendRequests = _friendRequests.filter(r => r.id !== requestId);

        return response({success: true});
    },

    // 친구 삭제
    removeFriend: async (friendId, userId) => {
        await delay(DELAY);

        const friend = _friends.find(f => f.id === friendId);

        if (!friend) {
            return response(null, false, '친구를 찾을 수 없습니다.');
        }

        // 친구 목록에서 제거
        _friends = _friends.filter(f => f.id !== friendId);

        return response({success: true});
    },

    // 사용자 차단
    blockUser: async (targetUserId, userId) => {
        await delay(DELAY);

        const target = _users.find(u => u.id === targetUserId);

        if (!target) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        // 이미 차단했는지 확인
        if (_blockedUsers.some(b => b.id === targetUserId)) {
            return response(null, false, '이미 차단한 사용자입니다.');
        }

        // 친구 목록에 있으면 제거
        _friends = _friends.filter(f => f.id !== targetUserId);

        // 차단 목록에 추가
        const blockedUser = {
            id: target.id,
            name: target.name,
            status: 'blocked',
            avatarText: target.name.charAt(0)
        };

        _blockedUsers.push(blockedUser);

        return response(blockedUser);
    },

    // 차단 해제
    unblockUser: async (userId, currentUserId) => {
        await delay(DELAY);

        const blockedUser = _blockedUsers.find(b => b.id === userId);

        if (!blockedUser) {
            return response(null, false, '차단 목록에서 사용자를 찾을 수 없습니다.');
        }

        // 차단 목록에서 제거
        _blockedUsers = _blockedUsers.filter(b => b.id !== userId);

        return response({success: true});
    }
};

// 프로필 관련 API
export const profileApi = {
    // 프로필 조회
    getProfile: async (userId) => {
        await delay(DELAY);

        const user = _users.find(u => u.id === userId);

        if (!user) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        // 비밀번호 필드 제외하고 반환
        const {password: _, ...userWithoutPassword} = user;

        return response({
            ...userWithoutPassword,
            posts_count: _posts.filter(p => p.author.id === userId).length,
            comments_count: _comments.filter(c => c.author.id === userId).length,
            friends_count: _friends.length
        });
    },

    // 프로필 수정
    updateProfile: async (profileData, userId) => {
        await delay(DELAY);

        const user = _users.find(u => u.id === userId);

        if (!user) {
            return response(null, false, '사용자를 찾을 수 없습니다.');
        }

        // 사용자 정보 업데이트
        const updatedUser = {...user, ...profileData};
        _users = _users.map(u => u.id === userId ? updatedUser : u);

        // 비밀번호 필드 제외하고 반환
        const {password: _, ...userWithoutPassword} = updatedUser;

        return response(userWithoutPassword);
    },

    // 감정 분석 기록 조회
    getEmotionHistory: async (userId) => {
        await delay(DELAY);

        const userEmotions = _emotionHistory.filter(e => e.userId === userId);
        return response(userEmotions);
    }
};

// 감정 분석 API
export const emotionApi = {
    // 텍스트 감정 분석
    analyzeEmotion: async (text) => {
        await delay(DELAY);

        if (!text) {
            return response({score: 0.5}, false, '분석할 텍스트가 없습니다.');
        }

        // TODO: 실제 NLP 기반 감정 분석 모델 연동 코드
        // 1. 백엔드 API 호출
        // const response = await fetch('/api/analyze-emotion', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ text })
        // });
        // const data = await response.json();
        // return response({ score: data.score, text });

        // 감정 분석 모델 연동 전 랜덤 점수 생성 (0.1~0.9)
        let score;
        let violationType = 'general';

        // 위반 유형 감지 - 시연용
        const insultWords = ['박쥐', '새끼', '시발', '죽어', '소리', '불만'];
        const defamationWords = ['거짓말', '염치', '소문', '빙신', '비소', '사기'];
        const mockeryWords = ['바보', '멍청', '한심', '웠다', '웃긴다', '슬프다'];
        const sexualWords = ['성적', '음탄', '몸매', '스킨십', '숨겨', '알둥'];
        const hateWords = ['인종', '노인', '진성', '성소수', '요날', '장애'];
        const generalNegativeWords = ['화나', '짜증', '싫어', '나쁨', '최악', '부정'];

        // 위반 유형 검사 및 점수 반환
        if (insultWords.some(word => text.toLowerCase().includes(word))) {
            score = 0.1 + Math.random() * 0.15;
            violationType = 'insult';
        } else if (sexualWords.some(word => text.toLowerCase().includes(word))) {
            score = 0.1 + Math.random() * 0.15;
            violationType = 'sexual';
        } else if (hateWords.some(word => text.toLowerCase().includes(word))) {
            score = 0.1 + Math.random() * 0.15;
            violationType = 'hate';
        } else if (defamationWords.some(word => text.toLowerCase().includes(word))) {
            score = 0.15 + Math.random() * 0.15;
            violationType = 'defamation';
        } else if (mockeryWords.some(word => text.toLowerCase().includes(word))) {
            score = 0.2 + Math.random() * 0.15;
            violationType = 'mockery';
        } else if (generalNegativeWords.some(word => text.toLowerCase().includes(word))) {
            score = 0.2 + Math.random() * 0.2;
            violationType = 'general';
        } else {
            // 그 외의 경우 0.3~0.9 사이의 랜덤 점수
            score = 0.3 + Math.random() * 0.6;
            violationType = null; // 위반 없음
        }

        return response({
            score,
            text,
            violationType
        });
    },

    // 감정 분석 기록 저장
    saveEmotionRecord: async (data, userId) => {
        await delay(DELAY);

        const newRecord = {
            id: _emotionHistory.length + 1,
            userId,
            score: data.score,
            date: new Date().toISOString().split('T')[0],
            context: data.context || '알 수 없음'
        };

        _emotionHistory.push(newRecord);
        return response(newRecord);
    }
};
