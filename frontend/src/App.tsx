import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { AuthProvider, useAuth } from './services/auth';
import Login from './pages/Auth/Login';
import SubmitComplaint from './pages/Complaint/SubmitComplaint';

function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DakSamadhan-AI
        </Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={() => window.location.href = '/submit-complaint'}>
              Submit Complaint
            </Button>
            <Button color="inherit" onClick={signOut}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" href="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          <NavBar />
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/submit-complaint" element={<SubmitComplaint />} />
              <Route path="/" element={<Navigate to="/submit-complaint" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
