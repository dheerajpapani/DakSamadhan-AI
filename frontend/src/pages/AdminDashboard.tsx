import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, Paper, Grid2 as Grid, Card, CardContent,
    Stack, Avatar, List, ListItem, ListItemAvatar, ListItemText,
    Divider, Chip, CircularProgress,
} from '@mui/material';
import { db } from '../services/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02'];

const StatCard = ({ title, value, icon, color, subtext }: any) => (
    <Card elevation={2} sx={{ height: '100%', borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography color="text.secondary" variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                        {value}
                    </Typography>
                    <Typography variant="body2" color={color}>{subtext}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${color}22`, color, width: 48, height: 48 }}>{icon}</Avatar>
            </Stack>
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
    // Read directly from Supabase with 15-second refresh
    const { data: complaints, isLoading } = useQuery({
        queryKey: ['complaints'],
        queryFn: async () => {
            const result = await db.from('complaints').select('*').order('created_at', { ascending: false });
            if (result.error) throw result.error;
            return result.data || [];
        },
        refetchInterval: 15000,
    });

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );

    const total = complaints?.length || 0;
    const open = complaints?.filter((c: any) => c.status === 'Open').length || 0;
    const resolved = complaints?.filter((c: any) => c.status === 'Resolved').length || 0;
    const highPriority = complaints?.filter((c: any) => c.priority === 'High').length || 0;

    const statusData = [
        { name: 'Open', value: open },
        { name: 'Resolved', value: resolved },
        { name: 'In Progress', value: complaints?.filter((c: any) => c.status === 'In Progress').length || 0 },
    ];

    const categoryCounts: Record<string, number> = {};
    complaints?.forEach((c: any) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

    const recentActivity = complaints?.slice(0, 5).map((c: any) => ({
        id: c.id,
        action: c.status === 'Resolved' ? 'Resolved Ticket' : c.status === 'In Progress' ? 'In Progress' : 'New Ticket',
        subject: c.subject,
        time: new Date(c.created_at).toLocaleString(),
    })) || [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1a237e">Dashboard Overview</Typography>
                    <Typography variant="body1" color="text.secondary">Live data from Supabase — refreshes every 15 seconds</Typography>
                </Box>
                <Chip icon={<AssessmentIcon />} label="Live" color="success" variant="outlined" />
            </Stack>

            {/* Key Metrics */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Complaints" value={total} icon={<AssignmentIcon />} color="#1976d2" subtext={`${resolved} resolved`} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Pending Actions" value={open} icon={<PendingActionsIcon />} color="#ed6c02" subtext="Requires attention" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Resolutions"
                        value={resolved}
                        icon={<CheckCircleOutlineIcon />}
                        color="#2e7d32"
                        subtext={`Rate: ${total > 0 ? Math.round((resolved / total) * 100) : 0}%`}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Critical Issues" value={highPriority} icon={<WarningAmberIcon />} color="#d32f2f" subtext="High priority" />
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Category Distribution</Typography>
                        {categoryData.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                                <Typography color="text.secondary">No data yet</Typography>
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={categoryData} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" fill="#1a237e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Status Overview</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {statusData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
                            <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
                        </Box>
                        <List>
                            {recentActivity.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No complaints yet.</Typography>
                                </Box>
                            )}
                            {recentActivity.map((item: any, i: number) => (
                                <Box key={item.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: item.action.includes('Resolved') ? 'success.light' : 'primary.light' }}>
                                                {item.action.includes('Resolved') ? <CheckCircleOutlineIcon /> : <AssignmentIcon />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle2" fontWeight="bold">{item.action}</Typography>}
                                            secondary={
                                                <Box component="span">
                                                    <Typography variant="body2" color="text.primary">{item.subject}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {i < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Quick Stats</Typography>
                        <Stack spacing={2}>
                            {[
                                { label: 'Total Submitted', val: total },
                                { label: 'Open', val: open },
                                { label: 'In Progress', val: complaints?.filter((c: any) => c.status === 'In Progress').length || 0 },
                                { label: 'Resolved', val: resolved },
                                { label: 'High Priority', val: highPriority },
                            ].map(({ label, val }) => (
                                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #f0f0f0' }}>
                                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                                    <Typography variant="h6" fontWeight="bold">{val}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
