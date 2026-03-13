import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQS = [
    {
        q: 'How do I track my complaint?',
        a: 'Navigate to "Track Status" and enter the Complaint ID you received on submission.',
    },
    {
        q: 'What information do I need to register a grievance?',
        a: 'A clear description of your issue, the category (e.g. Delivery Delay, Lost Article), and you must be logged in.',
    },
    {
        q: 'How long does it take to resolve a complaint?',
        a: 'Most complaints are processed within 24-48 hours. Complex cases may take up to 7 working days.',
    },
    {
        q: 'Can I modify my complaint after submission?',
        a: 'No. Once submitted, complaints cannot be modified to ensure data integrity. Submit a new complaint with updated information if needed.',
    },
];

export default function Help() {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
                Frequently Asked Questions
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6 }}>
                Find answers to common questions about DakSamadhan.
            </Typography>
            <Box sx={{ maxWidth: 800 }}>
                {FAQS.map((faq, i) => (
                    <Accordion key={i} defaultExpanded={i === 0} elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" fontWeight="bold">{faq.q}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{faq.a}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Container>
    );
}
