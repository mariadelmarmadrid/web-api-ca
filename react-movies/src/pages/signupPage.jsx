/**
 * Signup Page
 * Allows a new user to register using `AuthContext.register`
 * - Validates password confirmation and shows registration status
 */
import { useContext, useState } from "react";
import { Navigate } from "react-router";
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

const SignupPage = () => {
    const auth = useContext(AuthContext);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        setError(""); // Clear previous errors
        
        // Client-side validation
        if (!userName.trim()) {
            setError("Username is required.");
            return;
        }
        
        if (password !== passwordAgain) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await auth.register(userName, password);
            if (result) {
                setRegistered(true);
            } else {
                // Registration failed - error message should come from backend
                setError("Registration failed. Username may already exist or password doesn't meet requirements.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (registered) {
        return <Navigate to="/login" replace />;
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
            <Card sx={{ width: 420 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h5" fontWeight={700}>
                            Sign Up
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Create an account to save favourites and build your watchlist
                        </Typography>

                        {error && (
                            <Alert severity="error" onClose={() => setError("")}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={isLoading}
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText="Minimum 8 characters, 1 number & 1 special character (@$!%*#?&)"
                            disabled={isLoading}
                            fullWidth
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            disabled={isLoading}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>

                        <Typography variant="body2" align="center">
                            Already have an account?{" "}
                            <a href="/login" style={{ textDecoration: "none" }}>
                                Login
                            </a>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SignupPage;
