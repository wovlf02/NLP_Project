import api from '../api';

/**
 * 차단 목록 조회
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getBlockedUsers = async () => {
    try {
        const res = await api.get('/blocks/users');
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '차단 목록 조회 실패',
        };
    }
};

/**
 * 사용자 차단
 * @param {number} targetUserId - 차단할 사용자 ID
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const blockUser = async (targetUserId) => {
    try {
        const res = await api.post(`/blocks/users/${targetUserId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '사용자 차단 실패',
        };
    }
};

/**
 * 차단 해제
 * @param {number} userId - 차단 해제할 사용자 ID
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const unblockUser = async (userId) => {
    try {
        const res = await api.delete(`/blocks/users/${userId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '차단 해제 실패',
        };
    }
};
