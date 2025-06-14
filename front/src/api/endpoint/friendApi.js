import api from '../api';

/**
 * 📌 친구 관련 API
 */
export const friendsApi = {
    /**
     * ✅ 친구 목록 조회
     * @param {number} userId
     */
    getFriends: async (userId) => {
        try {
            const res = await api.get(`/friends/list`, {
                params: { userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '친구 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 친구 요청 목록 조회
     * @param {number} userId
     */
    getFriendRequests: async (userId) => {
        try {
            const res = await api.get(`/friends/requests`, {
                params: { userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '친구 요청 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 차단 목록 조회
     * @param {number} userId
     */
    getBlockedUsers: async (userId) => {
        try {
            const res = await api.get(`/friends/blocked`, {
                params: { userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '차단 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 친구 요청 전송
     * @param {number} targetUserId
     * @param {number} userId
     */
    sendFriendRequest: async (targetUserId, userId) => {
        try {
            const res = await api.post(`/friends/request`, {
                targetUserId,
                userId
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '친구 요청 실패'
            };
        }
    },

    /**
     * ✅ 친구 요청 수락
     * @param {number} requestId
     * @param {number} userId
     */
    acceptFriendRequest: async (requestId, userId) => {
        try {
            const res = await api.post(`/friends/accept`, {
                requestId,
                userId
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '친구 요청 수락 실패'
            };
        }
    },

    /**
     * ✅ 친구 요청 거절
     * @param {number} requestId
     * @param {number} userId
     */
    rejectFriendRequest: async (requestId, userId) => {
        try {
            const res = await api.post(`/friends/reject`, {
                requestId,
                userId
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '친구 요청 거절 실패'
            };
        }
    },

    /**
     * ✅ 친구 삭제
     * @param {number} friendId
     * @param {number} userId
     */
    removeFriend: async (friendId, userId) => {
        try {
            const res = await api.delete(`/friends/remove`, {
                data: { friendId, userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '친구 삭제 실패'
            };
        }
    },

    /**
     * ✅ 사용자 차단
     * @param {number} targetUserId
     * @param {number} userId
     */
    blockUser: async (targetUserId, userId) => {
        try {
            const res = await api.post(`/friends/block`, {
                targetUserId,
                userId
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '사용자 차단 실패'
            };
        }
    },

    /**
     * ✅ 차단 해제
     * @param {number} targetUserId
     * @param {number} userId
     */
    unblockUser: async (targetUserId, userId) => {
        try {
            const res = await api.post(`/friends/unblock`, {
                targetUserId,
                userId
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '차단 해제 실패'
            };
        }
    }
};
