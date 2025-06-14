import api from '../api';

/**
 * 📌 감정 분석 관련 API
 */
export const emotionApi = {
    /**
     * ✅ 텍스트 감정 분석
     * @param {string} text
     */
    analyzeEmotion: async (text) => {
        if (!text) {
            return {
                success: false,
                error: '분석할 텍스트가 없습니다.',
                data: { score: 0.5, violationType: null }
            };
        }

        try {
            const res = await api.post('/emotion/analyze', { text });
            return {
                success: true,
                data: res.data.data
            };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '감정 분석 실패',
                data: { score: 0.5, violationType: null }
            };
        }
    },

    /**
     * ✅ 감정 분석 기록 저장
     * @param {object} data - { score, context }
     * @param {number} userId
     */
    saveEmotionRecord: async (data, userId) => {
        try {
            const res = await api.post('/emotion/save', {
                ...data,
                userId
            });
            return {
                success: true,
                data: res.data.data
            };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || '감정 기록 저장 실패'
            };
        }
    }
};
