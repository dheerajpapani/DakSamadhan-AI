import { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper,
    MenuItem, CircularProgress, Alert, IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';

const CATEGORIES = [
    'Delivery Delay',
    'Lost Article',
    'Damaged Item',
    'Staff Behavior',
    'Refund Issue',
    'Other',
];

export default function SubmitComplaint() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submittedData, setSubmittedData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await complaintService.submit({
                subject,
                description,
                email: user?.email || '',   // Use authenticated user's email
                category: category || undefined,
            });
            setSubmittedData(result);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.detail || 'Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (submittedData?.id) {
            navigator.clipboard.writeText(submittedData.id);
            alert('Complaint ID copied to clipboard!');
        }
    };

    const handleReset = () => {
        setSubmittedData(null);
        setSubject('');
        setDescription('');
        setCategory('');
        setError(null);
    };

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">Please login to submit a complaint.</Typography>
                <Button onClick={() => navigate('/login')} sx={{ mt: 2 }} variant="contained">
                    Go to Login
                </Button>
            </Box>
        );
    }

    if (submittedData) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
                <Paper sx={{ p: 5, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                        ✓ Submitted!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Your complaint has been registered and analysed by our AI.
                    </Typography>

                    <Box sx={{ my: 3, p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px dashed grey' }}>
                        <Typography variant="caption" color="textSecondary">Your Complaint ID</Typography>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', wordBreak: 'break-all', mt: 0.5 }}>
                            {submittedData.id}
                        </Typography>
                        <IconButton size="small" onClick={copyToClipboard} sx={{ mt: 0.5 }}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
                        <b>AI Analysis Result:</b><br />
                        {submittedData.priority !== 'Low' && (
                            <>Priority: <b>{submittedData.priority}</b><br /></>
                        )}
                        Category: <b>{submittedData.category}</b>
                    </Alert>

                    <Typography variant="body2" color="textSecondary" paragraph>
                        Save this ID — use it to track your complaint status anytime.
                    </Typography>

                    <Button variant="contained" onClick={handleReset} sx={{ mr: 2 }}>
                        Submit Another
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/track-status')}>
                        Track Status
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 600 }} elevation={3}>
                <Typography variant="h4" gutterBottom color="primary">
                    Submit a Complaint
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Logged in as <b>{user.email}</b>. Our AI will analyse your complaint automatically.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Subject"
                        fullWidth
                        required
                        margin="normal"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <TextField
                        select
                        label="Category (Optional — AI will auto-detect)"
                        fullWidth
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        fullWidth
                        required
                        multiline
                        rows={6}
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        helperText="Be detailed. Our AI analyses the text to assign category and priority."
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 2, borderRadius: 2 }}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                        {loading ? 'Analysing & Submitting...' : 'Submit Complaint'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
