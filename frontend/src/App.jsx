import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';


import DashboardLayout from './components/DashboardLayout';


import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import Subscription from './pages/Subscription';
import Charity from './pages/Charity';
import Winners from './pages/Winners';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-brand-beige flex items-center justify-center text-xl font-bold text-brand-olive">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-brand-beige flex items-center justify-center text-xl font-bold text-brand-olive">Loading...</div>;
  
  if (user) return <Navigate to="/dashboard" />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/scores" element={<ProtectedRoute><Scores /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/charity" element={<ProtectedRoute><Charity /></ProtectedRoute>} />
      <Route path="/winners" element={<ProtectedRoute><Winners /></ProtectedRoute>} />
      
      <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
