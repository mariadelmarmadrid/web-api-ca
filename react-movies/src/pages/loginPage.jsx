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
} from "@mui/material";

const LoginPage = () => {
    const auth = useContext(AuthContext);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async () => {
        await auth.authenticate(userName, password);
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

                        <TextField
                            label="Username"
                            variant="outlined"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                        >
                            Login
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
