import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Cek apakah ada error dari Supabase
        const error = new URLSearchParams(window.location.search).get('error');
        const errorDescription = new URLSearchParams(window.location.search).get('error_description');
        
        if (error) {
          throw new Error(errorDescription || 'Authentication error');
        }

        // Cek session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session) {
          // Cek apakah ini dari signup
          const isSignUp = window.location.href.includes('type=signup');
          
          if (isSignUp) {
            toast.success('Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.');
            navigate('/auth');
          } else {
            toast.success('Login berhasil!');
            navigate('/');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error dalam callback auth:', error);
        toast.error(error instanceof Error ? error.message : 'Gagal menyelesaikan proses autentikasi');
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
    </div>
  );
} 