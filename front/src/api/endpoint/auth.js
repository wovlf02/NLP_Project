import api from '../api';

/**
 * 로그인 요청
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const login = async (email, password) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '로그인 요청 중 오류 발생',
        };
    }
};

/**
 * 회원가입 요청
 * @param {object} userData
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const register = async (userData) => {
    try {
        const res = await api.post('/auth/register', userData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '회원가입 요청 중 오류 발생',
        };
    }
};
