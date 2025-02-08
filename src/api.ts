import { PostProps } from "./components/Post";
import axios from "axios";


export const api = axios.create({
    baseURL: "http://localhost:3000", 
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
        console.log("Post is" ,post);
        const response = await api.post('/posts', post,{
            headers:{
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    update: async (postId: string, formData: FormData) => {
        const response = await api.put(`/posts/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deletePost: async (postId: string) => {
        const response = await api.delete(`/posts/${postId}`);
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
    // getUrl: (){
    //     return api.b
    // }
};

export const commentsApi = {
    getByPostId: async (postId: string) => {
        const response = await api.get(`/comments/${postId}`);
        return response.data;
    },
    create: async (postId: string, userId: string, text: string) => {
        const owner = userId;
        const comment = text;
        const response = await api.post(`/comments`, {comment, owner,postId });
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

// Types
export interface UserProfileI {
    username: string;
    email: string;
    password: string;
    imgUrl: string,
    refreshToken?: string[];
}

export const userProfileApi = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getByUsername: async (username: string) => {
        const response = await api.get(`/users/${username}`);
        return response.data;
    },

    create: async (userData: UserProfileI) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    updateEmail: async (username: string, email: string) => {
        const response = await api.put(`/users/${username}`, { content: email });
        return response.data;
    },

    delete: async (username: string) => {
        const response = await api.delete(`/users/${username}`);
        return response.data;
    },
    updateProfileImage: async (req: UserProfileI) => {
        console.log("Image is" ,req);
        
        const response = await api.post(`/users/${req.username}`, req, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('response',response);
        return response.data;
    }
};

export default api;
