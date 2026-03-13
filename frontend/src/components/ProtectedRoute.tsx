import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../services/auth';

// Shows a spinner while session loads
const LoadingScreen = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
);

/**
 * CitizenRoute — only for role='citizen'.
 * Redirects to /login if not authenticated.
 * Redirects to /dashboard if logged in as official.
 */
export function CitizenRoute({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (role === 'official') return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
}

/**
 * StaffRoute — only for role='official'.
 * Redirects to /login if not authenticated.
 * Redirects to /submit-complaint if logged in as citizen.
 */
export function StaffRoute({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (role === 'citizen') return <Navigate to="/submit-complaint" replace />;
    return <>{children}</>;
}
