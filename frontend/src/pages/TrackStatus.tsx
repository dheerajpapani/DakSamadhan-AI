import { useState } from 'react';
import {
    Box, TextField, Button, Typography, Paper, Alert, Chip,
    CircularProgress, Divider, List, ListItem, ListItemText, Tab, Tabs
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { db } from '../services/supabase';
import { useAuth } from '../services/auth';

export default function TrackStatus() {
    const { user } = useAuth();
    const [tab, setTab] = useState(0);
    const [complaintId, setComplaintId] = useState('');
    const [searchId, setSearchId] = useState('');

    // 1. My Complaints Query (only for logged-in users)
    const { data: myComplaints, isLoading: loadingHistory } = useQuery({
        queryKey: ['my-complaints', user?.id],
        queryFn: async () => {
            const { data, error } = await db.from('complaints')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });

    // 2. Manual Search Query (for anyone)
    const { data: searchResult, isLoading: loadingSearch, isError: searchError } = useQuery({
        queryKey: ['complaint', searchId],
        queryFn: async () => {
            const result = await db.from('complaints').select('*').eq('id', searchId).single();
            if (result.error) throw result.error;
            return result.data;
        },
        enabled: !!searchId,
        retry: false,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (complaintId.trim()) {
            setSearchId(complaintId.trim());
        }
    };

    const renderComplaintDetails = (item: any) => (
        <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ID: {item.id}
                    </Typography>
                    <Chip
                        label={item.status}
                        size="small"
                        color={item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'warning' : 'primary'}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{item.subject}</Typography>
                </Grid>
                <Grid size={{ xs: user?.role === 'official' || item.priority !== 'Low' ? 6 : 12 }}>
                    <Typography variant="caption" color="textSecondary">Category</Typography>
                    <Typography variant="body2">{item.category}</Typography>
                </Grid>
                {(user?.role === 'official' || item.priority !== 'Low') && (
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Priority</Typography>
                        <Typography variant="body2" color={item.priority === 'High' ? 'error.main' : 'text.primary'}>
                            {item.priority}
                        </Typography>
                    </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">Description</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                </Grid>
                {item.resolution_notes && (
                    <Grid size={{ xs: 12 }}>
                        <Alert severity="success" sx={{ py: 0 }}>
                            <strong>Resolution:</strong> {item.resolution_notes}
                        </Alert>
                    </Grid>
                )}
            </Grid>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ maxWidth: 800, width: '100%', p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="primary">
                    Track Status
                </Typography>

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                    sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Search by ID" />
                    {user && <Tab label={`My History (${myComplaints?.length || 0})`} />}
                </Tabs>

                {/* TAB 0: SEARCH BY ID */}
                {tab === 0 && (
                    <Box>
                        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                            {user
                                ? "Enter a Complaint ID to track specific details."
                                : "Enter a Complaint ID (UUID) to track any grievance, even without logging in."}
                        </Typography>
                        <form onSubmit={handleSearch}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Enter Complaint ID"
                                    variant="outlined"
                                    size="small"
                                    value={complaintId}
                                    onChange={(e) => setComplaintId(e.target.value)}
                                    placeholder="e.g. 550e8400-e29b..."
                                />
                                <Button type="submit" variant="contained" disabled={!complaintId || loadingSearch}>
                                    {loadingSearch ? <CircularProgress size={24} /> : 'Track'}
                                </Button>
                            </Box>
                        </form>

                        {searchError && (
                            <Alert severity="error" sx={{ mt: 3 }}>
                                No complaint found with this ID. Please verify and try again.
                            </Alert>
                        )}

                        {searchResult && renderComplaintDetails(searchResult)}
                    </Box>
                )}

                {/* TAB 1: MY HISTORY (Logged-in only) */}
                {tab === 1 && user && (
                    <Box>
                        {loadingHistory ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : myComplaints && myComplaints.length > 0 ? (
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {myComplaints.map((c, idx) => (
                                    <Box key={c.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="subtitle1" fontWeight="600">{c.subject}</Typography>
                                                        <Chip
                                                            label={c.status}
                                                            size="small"
                                                            color={c.status === 'Resolved' ? 'success' : c.status === 'In Progress' ? 'warning' : 'primary'}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary" display="block" sx={{ mb: 1 }}>
                                                            {c.description.length > 100 ? c.description.substring(0, 100) + '...' : c.description}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Submitted: {new Date(c.created_at).toLocaleDateString()} • ID: {c.id}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        <Button
                                            size="small"
                                            onClick={() => { setComplaintId(c.id); setSearchId(c.id); setTab(0); }}
                                            sx={{ mb: 1 }}
                                        >
                                            View Full Details
                                        </Button>
                                        {idx < myComplaints.length - 1 && <Divider component="li" />}
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography color="text.secondary">You haven't submitted any complaints yet.</Typography>
                                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.href = '/submit-complaint'}>
                                    Submit a Complaint
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
