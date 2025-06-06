import api from '../api';

/**
 * 채팅방 목록 조회
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getChatRooms = async () => {
    try {
        const res = await api.get('/chat/rooms');
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '채팅방 목록 조회 실패',
        };
    }
};

/**
 * 채팅방 생성
 * @param {object} roomData - { name: string, participantIds: number[] }
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const createChatRoom = async (roomData) => {
    try {
        const res = await api.post('/chat/rooms', roomData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '채팅방 생성 실패',
        };
    }
};

/**
 * 메시지 목록 조회
 * @param {number} roomId
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getMessages = async (roomId) => {
    try {
        const res = await api.get(`/chat/rooms/${roomId}/messages`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '메시지 목록 조회 실패',
        };
    }
};

/**
 * 메시지 전송
 * @param {number} roomId
 * @param {string} text
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const sendMessage = async (roomId, text) => {
    try {
        const res = await api.post(`/chat/rooms/${roomId}/messages`, { text });
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '메시지 전송 실패',
        };
    }
};
