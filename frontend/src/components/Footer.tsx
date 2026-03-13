import { useState } from 'react';
import { Box, Typography, Link, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Footer() {
    const [openPrivacy, setOpenPrivacy] = useState(false);

    return (
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.primary.main, color: 'white' }}>
            <Box sx={{ px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="body1" fontWeight="bold">DakSamadhan</Typography>
                    <Typography variant="caption">Department of Posts, Government of India</Typography>
                </Box>
                <Box>
                    <Link href="/" color="inherit" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Home</Link>
                    <Link href="/help" color="inherit" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Help</Link>
                    <Link href="/contact" color="inherit" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Contact</Link>
                    <Link
                        component="button"
                        color="inherit"
                        onClick={() => setOpenPrivacy(true)}
                        sx={{ mx: 2, textDecoration: 'none', fontFamily: 'inherit', fontSize: 'inherit', border: 0, bgcolor: 'transparent', cursor: 'pointer' }}
                    >
                        Privacy Policy
                    </Link>
                </Box>
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 2, opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', pt: 2 }}>
                © {new Date().getFullYear()} DakSamadhan. All rights reserved.
            </Typography>

            <Dialog open={openPrivacy} onClose={() => setOpenPrivacy(false)} maxWidth="md">
                <DialogTitle>Privacy Policy</DialogTitle>
                <DialogContent dividers>
                    <Typography paragraph><strong>1. Information Collection</strong><br />We collect personal information such as email only for the purpose of grievance redressal.</Typography>
                    <Typography paragraph><strong>2. Data Usage</strong><br />Your data is used solely to process complaints. We do not sell or share it with third parties.</Typography>
                    <Typography paragraph><strong>3. Data Security</strong><br />We implement strict security measures to protect your data from unauthorized access.</Typography>
                    <Typography><strong>4. Contact Us</strong><br />Questions? Contact our support team at support@indiapost.gov.in.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPrivacy(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
