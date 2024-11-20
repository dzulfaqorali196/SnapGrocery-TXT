import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/auth/AuthProvider';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/home/HomePage';
import { AuthPage } from './components/auth/AuthPage';
import { ApiDocsPage } from './components/docs/ApiDocsPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AuthCallback } from './components/auth/AuthCallback';
import { ComingSoonPage } from './components/common/ComingSoonPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/api-docs"
              element={
                <ProtectedRoute>
                  <ApiDocsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capture"
              element={
                <ProtectedRoute>
                  <ComingSoonPage title="Capture Feature Coming Soon" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <ComingSoonPage title="Upload Feature Coming Soon" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ComingSoonPage title="Profile Page Coming Soon" />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;