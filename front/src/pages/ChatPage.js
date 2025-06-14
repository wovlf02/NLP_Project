import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 채팅 컴포넌트들은 나중에 분리할 예정입니다
import ChatRoom from '../components/Chat/ChatRoom';
import ChatList from '../components/Chat/ChatList';
import WarningModal from '../components/Common/WarningModal';

// Mock API 임포트
import { chatApi, emotionApi } from '../api/mockApi';

const ChatPageContainer = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    height: calc(100vh - 200px);
    min-height: 600px;
    padding: 1rem;
    gap: 1rem;
`;

const ChatListContainer = styled.div`
    width: 300px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatRoomContainer = styled.div`
    flex: 1;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;

function ChatPage() {
    const [chatRooms, setChatRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [draftMessage, setDraftMessage] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [pendingMessage, setPendingMessage] = useState('');
    const [pendingEmotionScore, setPendingEmotionScore] = useState(0);
    const [pendingViolationType, setPendingViolationType] = useState('');
    const [currentUserId] = useState(1); // 임시 사용자 ID

    // 채팅방 데이터 로드 (Mock API 호출)
    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await chatApi.getChatRooms(currentUserId);
                if (response.success) {
                    setChatRooms(response.data);
                } else {
                    console.error('채팅방 로드 실패:', response.error);
                }
            } catch (error) {
                console.error('채팅방 로드 실패:', error);
            }
        };

        fetchChatRooms();
    }, [currentUserId]);

    // 채팅방 선택 처리
    const handleSelectRoom = async (roomId) => {
        setSelectedRoom(roomId);

        try {
            // Mock API로 메시지 가져오기
            const response = await chatApi.getMessages(roomId);
            if (response.success) {
                setMessages(response.data);
            } else {
                console.error('메시지 로드 실패:', response.error);
            }

            // 채팅방 목록에서 읽음 표시 업데이트
            setChatRooms(chatRooms.map(room =>
                room.id === roomId ? { ...room, unreadCount: 0 } : room
            ));
        } catch (error) {
            console.error('메시지 로드 실패:', error);
        }
    };

    // 메시지 작성 처리
    const handleMessageChange = (e) => {
        setDraftMessage(e.target.value);
    };

    // 메시지 전송 처리
    const handleSendMessage = async () => {
        if (!draftMessage.trim()) return;

        try {
            // 감정 분석 API 호출
            const emotionResponse = await emotionApi.analyzeEmotion(draftMessage);

            if (emotionResponse.success && emotionResponse.data) {
                const { score, violationType } = emotionResponse.data;

                // violationType이 존재하면 모달 띄움 (score 무관)
                if (violationType) { // 변경된 부분
                    setPendingMessage(draftMessage);
                    setPendingEmotionScore(score);
                    setPendingViolationType(violationType);
                    setShowWarning(true);
                    return;
                }

                // 위배가 아니면 바로 메시지 전송
                await sendMessage(draftMessage, score);
            }
        } catch (err) {
            console.error('감정 분석 실패:', err);
            await sendMessage(draftMessage, 0.5);
        }
    };


    // 실제 메시지 전송 함수
    const sendMessage = async (text, emotionScore = 0.5) => {
        try {
            // 메시지 전송 API 호출
            const messageResponse = await chatApi.sendMessage(
                {
                    roomId: selectedRoom,
                    text: text,
                    emotionScore: emotionScore // 감정 점수 전달
                },
                currentUserId
            );

            if (messageResponse.success) {
                // 메시지 목록 업데이트
                setMessages([...messages, messageResponse.data]);

                // 채팅방 목록 업데이트
                setChatRooms(chatRooms.map(room =>
                    room.id === selectedRoom
                        ? {
                            ...room,
                            lastMessage: text,
                            lastMessageTime: new Date().toISOString(),
                            timestamp: '방금'
                        }
                        : room
                ));

                // 감정 기록 저장
                await emotionApi.saveEmotionRecord(
                    { score: emotionScore, context: '채팅 메시지' },
                    currentUserId
                );
            }

            setDraftMessage('');
        } catch (error) {
            console.error('메시지 전송 실패:', error);
        }
    };

    // 경고 모달에서 '그래도 전송하기' 버튼 클릭 시
    const handleConfirmSend = async () => {
        try {
            await sendMessage(pendingMessage, pendingEmotionScore);

            // 모달 닫기 및 상태 초기화
            setShowWarning(false);
            setPendingMessage('');
            setPendingEmotionScore(0);
            setPendingViolationType('');
        } catch (err) {
            console.error('메시지 전송 실패:', err);
        }
    };

    // 경고 모달에서 '수정하기' 버튼 클릭 시
    const handleCancelSend = () => {
        setShowWarning(false);
        setPendingMessage('');
        setPendingEmotionScore(0);
        setPendingViolationType('');
        // 입력 필드는 그대로 유지
    };

    return (
        <ChatPageContainer>
            <ChatListContainer>
                <ChatList
                    chatRooms={chatRooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={handleSelectRoom}
                />
            </ChatListContainer>

            <ChatRoomContainer>
                {selectedRoom ? (
                    <ChatRoom
                        room={chatRooms.find(room => room.id === selectedRoom)}
                        messages={messages}
                        draftMessage={draftMessage}
                        onMessageChange={handleMessageChange}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: '#888'
                    }}>
                        채팅방을 선택해주세요
                    </div>
                )}
            </ChatRoomContainer>

            {/* 경고 모달 */}
            {showWarning && (
                <WarningModal
                    score={pendingEmotionScore}
                    violationType={pendingViolationType}
                    onCancel={handleCancelSend}
                    onConfirm={handleConfirmSend}
                />
            )}
        </ChatPageContainer>
    );
}

export default ChatPage;
