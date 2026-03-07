import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api.js";
import type { User } from "../types/app.js";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("token");
    });
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (isAuthenticated && !user) {
            api.getMe()
                .then((data) => setUser(data.user))
                .catch(() => {
                    logout();
                });
        }
    }, [isAuthenticated, user]);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext)!;
