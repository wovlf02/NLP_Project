import api from '../api';

/**
 * 게시글 목록 조회
 * @param {string|null} category - 카테고리명 (선택)
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getPosts = async (category = null) => {
    try {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        const res = await api.get(`/posts${query}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '게시글 목록 조회 실패',
        };
    }
};

/**
 * 게시글 상세 조회
 * @param {number} postId
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const getPost = async (postId) => {
    try {
        const res = await api.get(`/posts/${postId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '게시글 조회 실패',
        };
    }
};

/**
 * 게시글 작성
 * @param {{ title: string, content: string, category: string }} postData
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const createPost = async (postData) => {
    try {
        const res = await api.post('/posts', postData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '게시글 작성 실패',
        };
    }
};

/**
 * 게시글 수정
 * @param {number} postId
 * @param {{ title?: string, content?: string, category?: string }} updateData
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const updatePost = async (postId, updateData) => {
    try {
        const res = await api.put(`/posts/${postId}`, updateData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '게시글 수정 실패',
        };
    }
};

/**
 * 게시글 삭제
 * @param {number} postId
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const deletePost = async (postId) => {
    try {
        const res = await api.delete(`/posts/${postId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '게시글 삭제 실패',
        };
    }
};
