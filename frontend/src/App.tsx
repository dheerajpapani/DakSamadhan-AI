import { Box, Container, Typography, AppBar, Toolbar, Button } from '@mui/material';

function App() {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DakSamadhan-AI
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to DakSamadhan
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          AI-Powered Complaint Management System for Indian Post
        </Typography>
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="body1">
            System initialization in progress...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
