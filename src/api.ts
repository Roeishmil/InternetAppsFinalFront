
import { PostProps } from "./components/Post";
import axios from "axios";


export const api = axios.create({
    baseURL: 'http://localhost:3000', 
    headers: {
        'Content-Type': 'application/json'
     }
 });

export const postsApi = {
    getAll: async () => {
        const response = await api.get('/posts');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },
    create: async (post: PostProps) => {
        const response = await api.post('/posts', post);
        return response.data;
    },
    likePost: async (postId: string, userId: string) => {
        const response = await api.post(`/posts/${postId}/like`, { userId });
        return response
    },
    unlikePost: async (postId: string, userId: string) => {
        const response = await api.post(`/posts/${postId}/delete`, { userId });
        return response.data;
    }
};

export const commentsApi = {
    getByPostId: async (postId: string) => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },
    create: async (postId: string, userId: string, text: string) => {
        const response = await api.post(`/posts/${postId}/comments`, { userId, text });
        return response.data;
    },
    delete: async (postId: string, commentId: string) => {
        const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data;
    }, 
    update: async (postId: string, commentId: string, text: string) => {
        const response = await api.put(`/posts/${postId}/comments/${commentId}`, { text });
        return response.data;
    }     
};

export default api;
