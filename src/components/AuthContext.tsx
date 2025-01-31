import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    id: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    switchUser: (userId: string) => void; // ✅ נוספה הפונקציה כאן
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const users: User[] = [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
    ];
    
    const [user, setUser] = useState<User | null>(users[0]); // משתמש ברירת מחדל
    
    const login = (user: User) => setUser(user);
    const logout = () => setUser(null);
    
    // ✅ פונקציה להחלפת משתמשים
    const switchUser = (userId: string) => {
        const newUser = users.find(u => u.id === userId) || null;
        console.log("Switching to user:", newUser);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, switchUser }}>
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
