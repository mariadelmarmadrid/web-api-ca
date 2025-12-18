import { useState, createContext } from "react";
import { login, signup } from "../api/auth-api";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
    const existingToken = localStorage.getItem("token");

    const [isAuthenticated, setIsAuthenticated] = useState(!!existingToken);
    const [authToken, setAuthToken] = useState(existingToken);
    const [userName, setUserName] = useState("");

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
        setAuthToken(null);
        setIsAuthenticated(false);
        setUserName("");
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