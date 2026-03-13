import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/auth';
import { CitizenRoute, StaffRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Help from './pages/Help';
import Contact from './pages/Contact';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackStatus from './pages/TrackStatus';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/track-status" element={<TrackStatus />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />

            {/* Citizen-only routes */}
            <Route path="/submit-complaint" element={
              <CitizenRoute><SubmitComplaint /></CitizenRoute>
            } />

            {/* Staff-only routes */}
            <Route path="/dashboard" element={
              <StaffRoute><Dashboard /></StaffRoute>
            } />
            <Route path="/admin-dashboard" element={
              <StaffRoute><AdminDashboard /></StaffRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
