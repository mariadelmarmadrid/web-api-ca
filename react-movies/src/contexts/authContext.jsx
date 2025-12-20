import { useState, useEffect, createContext } from "react";
import { login, signup } from "../api/auth-api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
    const existingToken = localStorage.getItem("token");

    let initialUser = "";
    let initialAuth = false;

    if (existingToken) {
        try {
            const decoded = jwtDecode(existingToken);
            initialUser = decoded.username;
            initialAuth = true;
        } catch {
            localStorage.removeItem("token");
        }
    }

    const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
    const [authToken, setAuthToken] = useState(existingToken);
    const [userName, setUserName] = useState(initialUser);

    useEffect(() => {
        if (authToken) {
            try {
                const decoded = jwtDecode(authToken);
                setUserName(decoded.username);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("token");
                setUserName("");
                setIsAuthenticated(false);
            }
        }
    }, [authToken]);

    // Store JWT token
    const setToken = (token) => {
        localStorage.setItem("token", token);
        setAuthToken(token);
    };

    // Login
    const authenticate = async (username, password) => {
        const result = await login(username, password);

        if (result.token) {
            setToken(result.token);
            setIsAuthenticated(true);
            setUserName(username);
            return true;
        }
        return false;
    };

    // Signup
    const register = async (username, password) => {
        const result = await signup(username, password);
        return result.success;
    };

    // Logout
    const signout = () => {
        localStorage.removeItem("token");
        setUserName("");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                authenticate,
                register,
                signout,
                userName,
                authToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;