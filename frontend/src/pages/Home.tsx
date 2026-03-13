import { Box, Typography, Button, Paper, Container, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../services/auth';
import { useQuery } from '@tanstack/react-query';
import { db } from '../services/supabase';

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch public stats directly from Supabase
    const { data: stats } = useQuery({
        queryKey: ['publicStats'],
        queryFn: async () => {
            const result = await db.from('complaints').select('id, status');
            const complaints = result.data || [];
            const resolved_count = complaints.filter((c: any) => c.status === 'Resolved').length;
            return { resolved_count, operational: true };
        },
        refetchInterval: 30000, // refresh every 30s
    });

    const handleRegisterClick = () => {
        if (user) {
            navigate('/submit-complaint');
        } else {
            navigate('/login');
        }
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <Box sx={{
                bgcolor: '#800000',
                background: 'linear-gradient(135deg, #6a0000 0%, #900000 100%)',
                color: 'white',
                pt: { xs: 8, md: 16 },
                pb: { xs: 10, md: 24 },
                px: 2,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.8, fontWeight: 'bold', mb: 2, display: 'block' }}>
                                    DEPARTMENT OF POSTS, INDIA
                                </Typography>
                                <Typography variant="h2" component="h1" fontWeight="800" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.1, mb: 3, letterSpacing: '-1px' }}>
                                    DakSamadhan
                                </Typography>
                                <Typography variant="h5" sx={{ mb: 5, opacity: 0.9, fontWeight: 400, maxWidth: '600px', mx: { xs: 'auto', md: 0 }, lineHeight: 1.6 }}>
                                    The Next-Gen AI-Powered Grievance Redressal System.
                                    Resolving your postal concerns with unprecedented speed and transparency.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleRegisterClick}
                                        sx={{ py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px' }}
                                    >
                                        Register Grievance
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        size="large"
                                        onClick={() => navigate('/track-status')}
                                        sx={{ py: 1.5, px: 4, fontSize: '1.1rem', borderRadius: '50px', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                    >
                                        Track Status
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Paper elevation={24} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                                        System Status
                                    </Typography>
                                    <Stack spacing={3} mt={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">AI ENGINE</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', fontWeight: 'bold' }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                                                Operational
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">AVG RESOLUTION TIME</Typography>
                                            <Typography variant="h4" color="primary.main" fontWeight="800">24 Hrs</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">GRIEVANCES RESOLVED</Typography>
                                            <Typography variant="h4" color="secondary.dark" fontWeight="800">
                                                {stats ? stats.resolved_count : '...'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Box sx={{ py: 10, bgcolor: '#f5f5f7' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {[
                            { icon: <AutoFixHighIcon sx={{ color: 'white', fontSize: 32 }} />, color: 'primary.main', title: 'AI Powered Analysis', text: 'Our advanced NLP instantly categorizes your complaint, detecting urgency and sentiment to prioritize critical issues.' },
                            { icon: <SpeedIcon sx={{ color: 'black', fontSize: 32 }} />, color: 'secondary.main', title: 'Rocket Speed', text: 'Automated workflows ensure your grievance reaches the exact right officer instantly, cutting wait times by 80%.' },
                            { icon: <SecurityIcon sx={{ color: 'white', fontSize: 32 }} />, color: 'primary.dark', title: 'Secure & Transparent', text: 'Track every step. You get a unique tracking ID and real-time updates until your issue is fully resolved.' },
                        ].map((feat, i) => (
                            <Grid key={i} size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 4, height: '100%', borderRadius: 4, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }} elevation={2}>
                                    <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: feat.color, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                                        {feat.icon}
                                    </Box>
                                    <Typography variant="h5" gutterBottom fontWeight="bold">{feat.title}</Typography>
                                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{feat.text}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
