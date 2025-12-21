/**
 * Login Page
 * Provides a login form and uses `AuthContext.authenticate` to sign in
 * - Redirects to the originally requested page on successful login
 */
import { useContext, useState } from "react";
import { Navigate, useLocation, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
} from "@mui/material";

const LoginPage = () => {
    const auth = useContext(AuthContext);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async () => {
        setError(""); // Clear previous errors
        setIsLoading(true);
        
        try {
            const success = await auth.authenticate(userName, password);
            if (!success) {
                setError("Login failed. Please check your credentials and try again.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (auth.isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    return (
        <Box
            sx={{
                minHeight: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card sx={{ width: 380 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h5" fontWeight={700}>
                            Login
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Sign in to access your favourites and watchlist
                        </Typography>

                        {error && (
                            <Alert severity="error" onClose={() => setError("")}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Username"
                            variant="outlined"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={isLoading}
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>

                        <Typography variant="body2" align="center">
                            Not registered?{" "}
                            <Link to="/signup" style={{ textDecoration: "none" }}>
                                Sign up
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
