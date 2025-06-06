import api from '../api';

/**
 * 텍스트 감정 분석 요청
 * @param {string} text - 분석할 텍스트
 * @returns {Promise<{ success: boolean, data: { score: number, text: string, violationType: string | null }, error: string }>}
 */
export const analyzeEmotion = async (text) => {
    try {
        const res = await api.post('/emotion/analyze', { text });
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: { score: 0.5, text, violationType: null },
            error: error.response?.data?.error || '감정 분석 실패',
        };
    }
};

/**
 * 감정 분석 기록 저장
 * @param {{ score: number, context: string }} data
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const saveEmotionRecord = async (data) => {
    try {
        const res = await api.post('/emotion/save', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '감정 분석 기록 저장 실패',
        };
    }
};
