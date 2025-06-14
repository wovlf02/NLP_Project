import api from '../api';

/**
 * 📌 프로필 관련 API
 */
export const profileApi = {
    /**
     * ✅ 사용자 프로필 조회
     * @param {number} userId
     */
    getProfile: async (userId) => {
        try {
            const res = await api.get(`/profile`, {
                params: { userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '프로필 조회 실패'
            };
        }
    },

    /**
     * ✅ 사용자 프로필 수정
     * @param {object} profileData
     * @param {number} userId
     */
    updateProfile: async (profileData, userId) => {
        try {
            const res = await api.put(`/profile/update`, {
                ...profileData,
                userId
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '프로필 수정 실패'
            };
        }
    },

    /**
     * ✅ 감정 분석 기록 조회
     * @param {number} userId
     */
    getEmotionHistory: async (userId) => {
        try {
            const res = await api.get(`/profile/emotions`, {
                params: { userId }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '감정 분석 기록 조회 실패'
            };
        }
    }
};
