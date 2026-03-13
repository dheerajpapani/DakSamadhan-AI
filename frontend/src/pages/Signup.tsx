import { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper,
    Alert, Divider, Link
} from '@mui/material';
import { supabase } from '../services/supabase';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { role: 'citizen' }, // All self-sign-ups are citizens
                },
            });
            if (error) {
                if (error.message.includes('User already registered')) {
                    throw new Error('An account with this email already exists. Please login instead.');
                }
                throw error;
            }
            setInfo('Account created! Check your email for a confirmation link, then log in.');
            // Optionally redirect after a delay
            setTimeout(() => navigate('/login'), 5000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', py: 15, px: 2 }}>
            <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 440, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" align="center" color="primary" gutterBottom>
                    Join DakSamadhan
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    Create an account to submit and track grievances
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {info && <Alert severity="success" sx={{ mb: 2 }}>{info}</Alert>}

                <form onSubmit={handleSignUp}>
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
                        autoComplete="new-password"
                        inputProps={{ minLength: 6 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
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
                        {submitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>already have an account?</Divider>

                <Box sx={{ textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 'bold' }}>
                        Back to Login
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
}
