import api from '../api';

/**
 * 📌 게시판 관련 API
 */
export const boardApi = {
    /**
     * ✅ 게시글 목록 조회 (카테고리 필터링 가능)
     * @param {string|null} category
     */
    getPosts: async (category = null) => {
        try {
            const res = await api.get('/community/posts', {
                params: category ? { category } : {}
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '게시글 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 단일 게시글 조회 (조회수 포함)
     * @param {number} postId
     */
    getPostById: async (postId) => {
        try {
            const res = await api.get(`/community/posts/${postId}`);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '게시글 조회 실패'
            };
        }
    },

    /**
     * ✅ 게시글 작성 (multipart/form-data)
     * @param {object} postData - { title, content, category, tag?, file? }
     */
    createPost: async (postData) => {
        try {
            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('content', postData.content);
            formData.append('category', postData.category);
            if (postData.tag) formData.append('tag', postData.tag);
            if (postData.file) formData.append('file', postData.file);

            const res = await api.post('/community/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '게시글 작성 실패'
            };
        }
    },


    /**
     * ✅ 게시글 수정
     * @param {number} postId
     * @param {object} postData
     */
    updatePost: async (postId, postData) => {
        try {
            const res = await api.put(`/community/posts/${postId}/update`, postData);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '게시글 수정 실패'
            };
        }
    },

    /**
     * ✅ 게시글 삭제
     * @param {number} postId
     */
    deletePost: async (postId) => {
        try {
            const res = await api.delete(`/community/posts/${postId}/delete`);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '게시글 삭제 실패'
            };
        }
    },

    /**
     * ✅ 댓글 목록 조회 (게시글 기준)
     * @param {object} data - { post_id: number }
     */
    getCommentsByPost: async (data) => {
        try {
            const res = await api.post('/community/comments/by-post', data);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '댓글 목록 조회 실패'
            };
        }
    },

    /**
     * ✅ 댓글 작성
     * @param {object} data - { post_id, content, emotion_score }
     */
    createComment: async (data) => {
        try {
            const res = await api.post('/community/comments/create', data);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '댓글 작성 실패'
            };
        }
    },

    /**
     * ✅ 대댓글 작성
     * @param {object} data - { post_id, parent_id, content, emotion_score }
     */
    createReply: async (data) => {
        try {
            const res = await api.post('/community/replies/create', data);
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                data: null,
                error: err.response?.data?.message || '대댓글 작성 실패'
            };
        }
    }
};
