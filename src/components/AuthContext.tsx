import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";
interface User {
    id: string;
    name: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const userData: User = response.data as User;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await axios.post(`${API_URL}/register`, { name, email, password });
            await login(email, password); // ✅ רישום + התחברות אוטומטית
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
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
