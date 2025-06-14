import api from '../api';

/**
 * 📌 채팅 관련 API
 */
export const chatApi = {
    /**
     * ✅ 사용자의 채팅방 목록 조회
     * @param {number} userId
     */
    getChatRooms: async (userId) => {
        try {
            const res = await api.get(`/chat/rooms`, {
                params: { userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '채팅방 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 채팅방 생성
     * @param {object} roomData - { name, participantIds: [1, 2, ...] }
     */
    createChatRoom: async (roomData) => {
        try {
            const res = await api.post(`/chat/rooms/create`, roomData);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '채팅방 생성 실패'
            };
        }
    },

    /**
     * ✅ 특정 채팅방의 메시지 목록 조회
     * @param {number} roomId
     */
    getMessages: async (roomId) => {
        try {
            const res = await api.get(`/chat/rooms/${roomId}/messages`);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '메시지 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 채팅 메시지 전송
     * @param {object} messageData - { roomId, text, senderId }
     */
    sendMessage: async (messageData) => {
        try {
            const res = await api.post(`/chat/messages/send`, messageData);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '메시지 전송 실패'
            };
        }
    }
};
