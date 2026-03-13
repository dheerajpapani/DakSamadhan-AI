import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box, Typography, Paper, Chip, CircularProgress,
    Button, Dialog, DialogTitle, DialogContent,
    TextField, DialogActions, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { db } from '../services/supabase';
import { complaintService } from '../services/api';
import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [openResolve, setOpenResolve] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [resolutionNotes, setResolutionNotes] = useState('');

    // Read directly from Supabase with 10-second polling
    const { data: complaints, isLoading } = useQuery({
        queryKey: ['complaints'],
        queryFn: async () => {
            const result = await db.from('complaints').select('*').order('created_at', { ascending: false });
            if (result.error) throw result.error;
            return result.data || [];
        },
        refetchInterval: 10000,
    });

    const resolveMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string }) =>
            complaintService.resolve(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            setOpenResolve(false);
            setResolutionNotes('');
        },
        onError: (error) => {
            console.error('Resolve failed:', error);
        },
    });

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 280, renderCell: (p) => <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{p.value}</Typography> },
        { field: 'subject', headerName: 'Subject', width: 200 },
        {
            field: 'category', headerName: 'Category', width: 150,
            renderCell: (p) => <Chip label={p.value} variant="outlined" size="small" />
        },
        {
            field: 'priority', headerName: 'Priority', width: 100,
            renderCell: (p) => {
                const color: any = p.value === 'High' ? 'error' : p.value === 'Medium' ? 'warning' : 'success';
                return <Chip label={p.value} color={color} size="small" />;
            }
        },
        {
            field: 'status', headerName: 'Status', width: 130,
            renderCell: (p) => (
                <Chip
                    label={p.value}
                    color={p.value === 'Resolved' ? 'success' : p.value === 'In Progress' ? 'warning' : 'primary'}
                    variant={p.value === 'Resolved' ? 'filled' : 'outlined'}
                    size="small"
                />
            )
        },
        {
            field: 'actions', headerName: 'Actions', width: 180, sortable: false,
            renderCell: (p) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => { setSelectedComplaint(p.row); setOpenView(true); }}>
                        View
                    </Button>
                    {p.row.status !== 'Resolved' && (
                        <Button variant="contained" color="success" size="small" onClick={() => { setSelectedId(p.row.id); setResolutionNotes(''); setOpenResolve(true); }}>
                            Resolve
                        </Button>
                    )}
                </Box>
            ),
        },
        { field: 'created_at', headerName: 'Date', width: 180, renderCell: (p) => new Date(p.value).toLocaleString() },
    ];

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Box sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Grievance Overview</Typography>
                <Button variant="outlined" onClick={() => navigate('/admin-dashboard')}>
                    Analytics Dashboard
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                        <Typography color="textSecondary">Total Complaints</Typography>
                        <Typography variant="h3" fontWeight="bold">{complaints?.length || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                        <Typography color="textSecondary">High Priority</Typography>
                        <Typography variant="h3" color="error" fontWeight="bold">
                            {complaints?.filter((c: any) => c.priority === 'High').length || 0}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                        <Typography color="textSecondary">Open / Pending</Typography>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {complaints?.filter((c: any) => c.status === 'Open').length || 0}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ height: 520, width: '100%', borderRadius: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid
                        rows={complaints || []}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.id}
                    />
                )}
            </Paper>

            {/* Resolve Dialog */}
            <Dialog open={openResolve} onClose={() => setOpenResolve(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Resolve Complaint</DialogTitle>
                <DialogContent>
                    {resolveMutation.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>Failed to resolve. Please try again.</Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Resolution Notes"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        helperText="Describe how the issue was resolved. This will be visible to the citizen."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenResolve(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (!resolutionNotes.trim()) { alert('Please enter resolution notes.'); return; }
                            resolveMutation.mutate({ id: selectedId, notes: resolutionNotes });
                        }}
                        variant="contained"
                        color="success"
                        disabled={resolveMutation.isPending}
                    >
                        {resolveMutation.isPending ? 'Saving...' : 'Mark Resolved'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Complaint Details</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedComplaint && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Complaint ID</Typography>
                                <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>{selectedComplaint.id}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Category</Typography>
                                    <Chip label={selectedComplaint.category} size="small" variant="outlined" sx={{ display: 'flex', width: 'fit-content', mt: 0.5 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Priority</Typography>
                                    <Chip
                                        label={selectedComplaint.priority}
                                        size="small"
                                        color={selectedComplaint.priority === 'High' ? 'error' : selectedComplaint.priority === 'Medium' ? 'warning' : 'success'}
                                        sx={{ display: 'flex', width: 'fit-content', mt: 0.5 }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={selectedComplaint.status}
                                        size="small"
                                        color={selectedComplaint.status === 'Resolved' ? 'success' : 'primary'}
                                        sx={{ display: 'flex', width: 'fit-content', mt: 0.5 }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Submitted by</Typography>
                                <Typography variant="body2">{selectedComplaint.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Subject</Typography>
                                <Typography variant="h6">{selectedComplaint.subject}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Description</Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                    <Typography variant="body1">{selectedComplaint.description}</Typography>
                                </Paper>
                            </Box>
                            {selectedComplaint.resolution_notes && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Resolution Notes</Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#e8f5e9', borderColor: '#c8e6c9' }}>
                                        <Typography variant="body1">{selectedComplaint.resolution_notes}</Typography>
                                    </Paper>
                                </Box>
                            )}
                            <Typography variant="caption" color="text.secondary">
                                Created: {new Date(selectedComplaint.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenView(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
