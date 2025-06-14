import api from '../api';

export const authApi = {
    // ✅ 로그인: POST /api/auth/login
    login: async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            return {
                success: true,
                data: res.data,
                error: null
            };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '로그인 중 오류가 발생했습니다.'
            };
        }
    },

    // ✅ 회원가입: POST /api/auth/register
    register: async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            return {
                success: true,
                data: res.data,
                error: null
            };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
            };
        }
    }
};
