import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Grid,
    CircularProgress,
    AppBar,
    Toolbar,
    Button
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { complaintService } from '../../services/api';
import { useAuth } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const { data: complaints, isLoading } = useQuery({
        queryKey: ['complaints'],
        queryFn: complaintService.getAll,
    });

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 200 },
        { field: 'subject', headerName: 'Subject', width: 200 },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            renderCell: (params) => (
                <Chip label={params.value} variant="outlined" />
            )
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 120,
            renderCell: (params) => {
                let color: 'default' | 'error' | 'warning' | 'success' = 'default';
                if (params.value === 'High') color = 'error';
                if (params.value === 'Medium') color = 'warning';
                if (params.value === 'Low') color = 'success';
                return <Chip label={params.value} color={color} size="small" />;
            }
        },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'created_at', headerName: 'Date', width: 200 },
    ];

    if (!user) {
        // Simple redirect
        navigate('/login');
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" color="default" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Staff Dashboard
                    </Typography>
                    <Button color="inherit" onClick={signOut}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3, flexGrow: 1, bgcolor: '#f4f6f8' }}>
                <Typography variant="h4" gutterBottom>
                    Grievance Overview
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography color="textSecondary">Total Complaints</Typography>
                            <Typography variant="h3">{complaints?.length || 0}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography color="textSecondary">High Priority</Typography>
                            <Typography variant="h3" color="error">
                                {complaints?.filter((c: any) => c.priority === 'High').length || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography color="textSecondary">Pending Action</Typography>
                            <Typography variant="h3" color="primary">
                                {complaints?.filter((c: any) => c.status === 'Open').length || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper sx={{ height: 500, width: '100%' }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataGrid
                            rows={complaints || []}
                            columns={columns}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5 } },
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            disableRowSelectionOnClick
                        />
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
