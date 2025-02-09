import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserProfileI } from "./userProfile";

const API_URL = "http://localhost:3000/auth";

interface AuthContextType {
    user: UserProfileI | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loginWithGoogle: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    //withCredentials: true, // Important for handling cookies
});

// Add interceptor to add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (error) {
                // If refresh fails, logout user
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
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
            // Check URL parameters for login success
            const params = new URLSearchParams(window.location.search);
            const loginSuccess = params.get('login');
            const token = params.get('token');

            // Try to load stored user first
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setIsLoading(false);
                return;
            }
            
            // If we have a successful login parameter, fetch the user profile
            if (loginSuccess === 'success' && token) {
                try {
                    localStorage.setItem("accessToken", token);
                    await fetchUserProfile();
                    // Clear URL parameters
                    window.history.replaceState({}, '', window.location.pathname);
                } catch (error) {
                    console.error("Failed to fetch user profile after login:", error);
                }
            }
            
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password });
            const { accessToken, refreshToken, ...userData } = response.data;
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(userData));
            
            setUser(userData);
            window.location.href = "/";
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await api.post('/register', { username, email, password });
            if (response.status === 200) {
                await login(email, password);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            throw new Error(error.response?.data?.message || "Registration failed");
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