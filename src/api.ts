import { PostProps } from "./components/Post";
import axios, { get } from "axios";


export const api = axios.create({
    baseURL: "http://localhost:3000", 
    headers: {
        'Content-Type': 'application/json'
     }
 });


// Add auth token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post("http://localhost:3000/auth/refresh", { refreshToken });
                const { accessToken } = response.data;
                localStorage.setItem("accessToken", accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
); 

export const postsApi = {
    getAll: async () => {
        const response = await api.get('/posts');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    create: async (post: FormData) => {
        const response = await api.post('/posts', post, {
            headers: {
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
        const response = await api.post(`/likes`, {
            userId,
            objectId: postId,
            objType: 'post'
        });
        return response.data;
    },

    unlikePost: async (postId: string, userId: string) => {
        const response = await api.delete(`/likes`, {
            data: {
                userId,
                objectId: postId,
                objType: 'post'
            }
        });
        return response.data;
    },

    checkLike: async (postId: string, userId: string) => {
        const response = await api.get(`/likes/check?userId=${userId}&objectId=${postId}&objType=post`);
        return response.data.hasLiked;
    },

    getLikeCount: async (postId: string) => {
        const response = await api.get(`/likes/${postId}/post/count`);
        return response.data.count;
    },

    getUserLikedPosts: async (userId: string) => {
        const response = await api.get(`/likes/user/${userId}/posts`);
        return response.data;
    }
};

export const commentsApi = {
    getAll: async () => {
        const response = await api.get('/comments');
        return response.data;
    },
    getByPostId: async (postId: string) => {
        const response = await api.get(`/comments/${postId}`);
        return response.data;
    },
    getUsernameByOwnerId: async (id:string) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    create: async (postId: string, userId: string, text: string, ownerName: string) => {
        const owner = userId;
        const comment = text;
        const response = await api.post(`/comments`, {comment, owner,postId,ownerName });
        return response.data;
    },
    delete: async ( commentId: string) => {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    }, 
    update: async ( commentId: string, text: string) => {
        const response = await api.put(`/comments/${commentId}`, { text });
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
