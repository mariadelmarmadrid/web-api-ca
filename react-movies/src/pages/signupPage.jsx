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
} from "@mui/material";

const SignupPage = () => {
    const auth = useContext(AuthContext);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        if (password !== passwordAgain) {
            setError("Passwords do not match");
            return;
        }

        const success = await auth.register(userName, password);
        if (success) {
            setRegistered(true);
        } else {
            setError("Registration failed. Username may already exist.");
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

                        <TextField
                            label="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText="Minimum 8 characters, 1 number & 1 symbol"
                            fullWidth
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            fullWidth
                        />

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRegister}
                        >
                            Create Account
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
