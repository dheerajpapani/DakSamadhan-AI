import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from '../services/auth';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, role, signOut } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const isDashboard = location.pathname.includes('dashboard');

    const handleLogout = async () => {
        setAnchorEl(null);
        await signOut();
        navigate('/');
    };

    const citizenNav = [
        { label: 'Submit Complaint', path: '/submit-complaint' },
        { label: 'Track Status', path: '/track-status' },
        { label: 'Help', path: '/help' },
    ];

    const staffNav = [
        { label: 'Grievances', path: '/dashboard' },
        { label: 'Analytics', path: '/admin-dashboard' },
    ];

    const publicNav = [
        { label: 'Track Status', path: '/track-status' },
        { label: 'Help', path: '/help' },
    ];

    const navLinks = user
        ? role === 'official' ? staffNav : citizenNav
        : publicNav;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <Box component="img" src="/ippb.avif" alt="IPPB Logo" sx={{ height: 40, mr: 2 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ cursor: 'pointer', fontWeight: 700, mr: 3 }}
                        onClick={() => navigate('/')}
                    >
                        DakSamadhan
                    </Typography>

                    {role === 'official' && (
                        <Chip label="Staff" color="warning" size="small" sx={{ mr: 2, fontWeight: 'bold' }} />
                    )}

                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 0.5 }}>
                        {navLinks.map((link) => (
                            <Button
                                key={link.path}
                                color="inherit"
                                onClick={() => navigate(link.path)}
                                sx={{
                                    fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                                    borderBottom: location.pathname === link.path ? '2px solid white' : 'none',
                                    borderRadius: 0,
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}
                    </Box>

                    {user ? (
                        <Box>
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit" size="large">
                                <Avatar sx={{ bgcolor: role === 'official' ? 'warning.main' : 'secondary.main', width: 32, height: 32, fontSize: '1rem' }}>
                                    {user.email?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem disabled>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">{user.email}</Typography>
                                        <Typography variant="caption" color={role === 'official' ? 'warning.main' : 'primary.main'} fontWeight="bold">
                                            {role === 'official' ? 'Staff / Official' : 'Citizen'}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>

            {!isDashboard && <Footer />}
        </Box>
    );
}
