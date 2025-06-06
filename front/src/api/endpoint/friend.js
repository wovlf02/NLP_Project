import api from '../api';

/**
 * 친구 목록 조회
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getFriends = async () => {
    try {
        const res = await api.get('/friends');
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '친구 목록 조회 실패',
        };
    }
};

/**
 * 친구 요청 목록 조회
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getFriendRequests = async () => {
    try {
        const res = await api.get('/friend-requests');
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '친구 요청 목록 조회 실패',
        };
    }
};

/**
 * 친구 요청 전송
 * @param {number} targetUserId
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const sendFriendRequest = async (targetUserId) => {
    try {
        const res = await api.post(`/friend-requests/${targetUserId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '친구 요청 전송 실패',
        };
    }
};

/**
 * 친구 요청 수락
 * @param {number} requestId
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const acceptFriendRequest = async (requestId) => {
    try {
        const res = await api.post(`/friend-requests/${requestId}/accept`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '친구 요청 수락 실패',
        };
    }
};

/**
 * 친구 요청 거절
 * @param {number} requestId
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const rejectFriendRequest = async (requestId) => {
    try {
        const res = await api.post(`/friend-requests/${requestId}/reject`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '친구 요청 거절 실패',
        };
    }
};

/**
 * 친구 삭제
 * @param {number} friendId
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const removeFriend = async (friendId) => {
    try {
        const res = await api.delete(`/friends/${friendId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '친구 삭제 실패',
        };
    }
};
