import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/auth/AuthProvider';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/home/HomePage';
import { AuthPage } from './components/auth/AuthPage';
import { ApiDocsPage } from './components/docs/ApiDocsPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';

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
                  <div>Capture Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <div>Upload Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div>Profile Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;