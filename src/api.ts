import axios from 'axios';
import { PostType } from './components/Post';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:3000', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interface for API response including any additional fields from backend
export interface PostResponse extends PostType {
    _id: string;
    // Add any other fields your backend returns
}

// Posts API methods
export const postsApi = {
    getAll: async (): Promise<PostResponse[]> => {
        const response = await api.get('/posts');
        return response.data as PostResponse[];
    },
    
    // You can add other post-related API methods here
    getById: async (id: string): Promise<PostResponse> => {
        const response = await api.get(`/posts/${id}`);
        return response.data as PostResponse;
    },
    
    create: async (post: PostType): Promise<PostResponse> => {
        const response = await api.post('/posts', post);
        return response.data as PostResponse;
    }
};

export default api;