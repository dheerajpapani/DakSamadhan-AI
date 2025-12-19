import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useAuth } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    'Delivery Delay',
    'Lost Article',
    'Damage',
    'Staff Behavior',
    'Other',
];

export default function SubmitComplaint() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Call Backend API
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // Reset form
            setSubject('');
            setDescription('');
            setCategory('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    Submit a Complaint
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    We are here to help. Please provide details below.
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Complaint submitted successfully! Ticket ID: #TEMP123
                    </Alert>
                )}

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
                        label="Category (Optional - AI will detect)"
                        fullWidth
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
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
                        helperText="Please be detailed. Our AI will analyze your concern."
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 2 }}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
