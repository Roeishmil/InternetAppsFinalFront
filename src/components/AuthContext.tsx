import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserProfileI } from "../api.ts";

const API_URL = "http://localhost:3000/auth";

interface AuthContextType {
    user: UserProfileI | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loginWithGoogle: () => void;
    isLoading: boolean;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    username: string;
    email: string;
    password: string;
    imgUrl: string;
    [key: string]: any;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data as { accessToken: string, refreshToken: string };
                
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfileI | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const loginSuccess = params.get('login');
                const token = params.get('token');

                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsLoading(false);
                    return;
                }
                
                if (loginSuccess === 'success' && token) {
                    try {
                        localStorage.setItem("accessToken", token);
                        await fetchUserProfile();
                        window.history.replaceState({}, '', window.location.pathname);
                    } catch (error) {
                        console.error("Failed to fetch user profile after login:", error);
                    }
                }
            } catch (error) {
                console.error("Error during auth initialization:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data as UserProfileI);
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password });
            const { accessToken, refreshToken, ...userData } = response.data as AuthResponse;
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(userData));
            
            const userProfile: UserProfileI = {
                username: userData.username,
                id: userData.id,
                email: userData.email,
                password: userData.password,
                imgUrl: userData.imgUrl,
            };
            setUser(userProfile);
            window.location.href = "/";
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed";
            throw new Error(errorMessage);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await api.post('/register', { username, email, password });
            if (response.status === 200) {
                await login(email, password);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Registration failed";
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            await api.post('/logout', { refreshToken });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    };

    const loginWithGoogle = () => {
        window.location.href = `${API_URL}/google`;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            loginWithGoogle,
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};