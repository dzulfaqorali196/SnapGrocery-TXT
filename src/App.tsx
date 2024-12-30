import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/auth/AuthProvider';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/home/HomePage';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AuthCallback } from './components/auth/AuthCallback';
import { ImageUpload } from './components/image/ImageUpload';
import { ComingSoonPage } from './components/common/ComingSoonPage';
import { SwaggerDocs } from './components/docs/SwaggerDocs';

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
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/capture" element={<ImageUpload />} />
              <Route path="/upload" element={<ImageUpload />} />
              <Route path="/api-docs" element={<SwaggerDocs />} />
              <Route path="/profile" element={<ComingSoonPage title="Profile Page Coming Soon" />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;