import api from '../api';

/**
 * 내 프로필 조회
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const getProfile = async () => {
    try {
        const res = await api.get('/users/me');
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '프로필 조회 실패',
        };
    }
};

/**
 * 내 프로필 수정
 * @param {{ name?: string, profileImage?: string, ... }} updateData
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const updateProfile = async (updateData) => {
    try {
        const res = await api.put('/users/me', updateData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '프로필 수정 실패',
        };
    }
};

/**
 * 감정 분석 기록 조회
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getEmotionHistory = async () => {
    try {
        const res = await api.get('/users/me/emotions');
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '감정 기록 조회 실패',
        };
    }
};
