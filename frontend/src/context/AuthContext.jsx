import { createContext, useState, useEffect } from "react";
import { login as loginApi } from "../api/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ username: decoded.sub });
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const data = await loginApi(username, password);
            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
