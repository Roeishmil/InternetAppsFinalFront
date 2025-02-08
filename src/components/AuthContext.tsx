import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { UserProfileI } from "./userProfile";


const API_URL = "http://localhost:3000/auth"; // Define the API URL

// interface UserProfileI {
//     id: string;
//     username: string;
//     token: string;
// }

interface AuthContextType {
    user: UserProfileI | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); 

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfileI | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []); 

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password }); // Send a POST request to the API
    
            if (response.status === 200) { 
                const userData: UserProfileI = response.data as UserProfileI; // Extract the user data from the response
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData)); // Store the user data in local storage
                alert("Login successful - welcome!");
                window.location.href = "/";
            } else {
                alert("Invalid credentials. Please try again.");  
            }
        } catch (error) {
            alert("Login failed: Invalid email or password."); 
            console.error("Login failed:", error);
        }
    };
    

    const register = async (username: string, email: string, password: string) => {
        try {
            console.log(username,password,email);
            const response = await axios.post(`${API_URL}/register`, { username, email , password },
                {
                    headers: { "Content-Type": "application/json"}
                }

            ); // Send a POST request to the API
            if(response.status == 200){
                alert('Registration Successfull!');
                await login(email, password); // Log in the user after registration
            }
        } catch (error) {
            alert("Registration failed: An error occurred. " + error.response?.data?.message || 'An unexpected error occured');
            console.log(API_URL);
            console.error("Registration failed:", error);
        }
    };

    const logout = () => {
        setUser(null); // Clear the user data
        localStorage.removeItem("user"); // Remove the user data from local storage
        alert("Logout successful - Goodbye");
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext); // Get the auth context
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
