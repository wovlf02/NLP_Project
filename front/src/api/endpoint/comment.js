import api from '../api';

/**
 * 댓글 목록 조회
 * @param {number} postId - 대상 게시글 ID
 * @returns {Promise<{ success: boolean, data: object[], error: string }>}
 */
export const getComments = async (postId) => {
    try {
        const res = await api.get(`/posts/${postId}/comments`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: [],
            error: error.response?.data?.error || '댓글 목록 조회 실패',
        };
    }
};

/**
 * 댓글 작성
 * @param {number} postId - 대상 게시글 ID
 * @param {object} commentData - { content: string, parent_id?: number, emotion_score?: number }
 * @returns {Promise<{ success: boolean, data: object, error: string }>}
 */
export const createComment = async (postId, commentData) => {
    try {
        const res = await api.post(`/posts/${postId}/comments`, commentData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || '댓글 작성 실패',
        };
    }
};
