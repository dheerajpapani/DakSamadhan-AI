import { Box, Typography, Container, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Contact() {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">Contact Us</Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6 }}>
                Reach out through any of the following channels.
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">Department of Posts</Typography>
                        <Typography variant="body1" paragraph>Government of India</Typography>
                        <List>
                            {[
                                { icon: <LocationOnIcon color="primary" />, label: 'Headquarters', value: 'Dak Bhawan, Sansad Marg, New Delhi - 110001' },
                                { icon: <PhoneIcon color="primary" />, label: 'Toll Free', value: '1800-266-6868' },
                                { icon: <EmailIcon color="primary" />, label: 'Email', value: 'support@indiapost.gov.in' },
                            ].map(({ icon, label, value }) => (
                                <ListItem key={label} sx={{ px: 0 }}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={label} secondary={value} primaryTypographyProps={{ fontWeight: 'bold' }} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ width: '100%', height: '100%', minHeight: 300, borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
                        <iframe
                            width="100%" height="100%"
                            frameBorder="0" scrolling="no"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=77.21040576696397%2C28.621453982823617%2C77.21558779478075%2C28.62354727142823&layer=mapnik&marker=28.622500632617637%2C77.21299678087234"
                            style={{ border: 0, minHeight: '350px' }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
