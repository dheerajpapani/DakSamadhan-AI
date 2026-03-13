import { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper,
    Alert, Tabs, Tab, Divider,
} from '@mui/material';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

// 0 = Citizen Portal, 1 = Staff Portal
type PortalMode = 0 | 1;

export default function Login() {
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect immediately
    if (!loading && user) {
        if (role === 'official') navigate('/dashboard', { replace: true });
        else navigate('/submit-complaint', { replace: true });
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [mode, setMode] = useState<PortalMode>(0);

    const reset = () => { setError(null); setInfo(null); };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        reset();
        try {
            const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });

            if (loginErr) {
                console.error("Supabase Login Error:", loginErr);

                if (loginErr.message.includes('Invalid login credentials')) {
                    // NOTE: This probe only works if "Email Enumeration Protection" is DISABLED in Supabase Dashboard.
                    // If it is ENABLED, resetPasswordForEmail always returns success.
                    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email);
                    const emailNotFound = !!resetErr;

                    if (mode === 0) {
                        throw new Error(emailNotFound
                            ? 'No account found. Please click "Create Account".'
                            : 'Invalid credentials.');
                    } else {
                        throw new Error(emailNotFound
                            ? 'You are not authorized as staff.'
                            : 'Invalid credentials.');
                    }
                }

                if (loginErr.message.includes('Email not confirmed')) {
                    throw new Error('Please confirm your email address before logging in.');
                }

                throw loginErr;
            }

            const userRole = data.user?.user_metadata?.role;

            // Enforce portal separation
            if (mode === 1 && userRole !== 'official') {
                await supabase.auth.signOut();
                throw new Error('You are not authorized as staff.');
            }
            if (mode === 0 && userRole === 'official') {
                await supabase.auth.signOut();
                throw new Error('Staff accounts must login via the Staff Portal.');
            }

            // Redirect based on role
            if (userRole === 'official') navigate('/dashboard');
            else navigate('/submit-complaint');
        } catch (err: any) {
            console.error("Login Handler Caught Error:", err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', py: 15, px: 2 }}>
            <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 440, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" align="center" color="primary" gutterBottom>
                    DakSamadhan
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    AI-Powered Grievance Redressal Portal
                </Typography>

                <Tabs
                    value={mode}
                    onChange={(_, v) => { setMode(v); reset(); }}
                    variant="fullWidth"
                    sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Citizen Portal" />
                    <Tab label="Staff Portal" />
                </Tabs>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {info && <Alert severity="success" sx={{ mb: 2 }}>{info}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email Address"
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        inputProps={{ minLength: 6 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={submitting}
                        sx={{ mt: 2, borderRadius: 2, py: 1.2 }}
                    >
                        {submitting ? 'Signing in...' : mode === 0 ? 'Login as Citizen' : 'Login as Staff'}
                    </Button>
                </form>

                {mode === 0 && (
                    <>
                        <Divider sx={{ my: 2 }}>or</Divider>
                        <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            onClick={() => navigate('/signup')}
                            sx={{ borderRadius: 2, py: 1.2 }}
                        >
                            Create Account
                        </Button>
                    </>
                )}

                {mode === 1 && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, textAlign: 'center' }}>
                        Staff accounts are created by your administrator. Contact support if you need access.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}
