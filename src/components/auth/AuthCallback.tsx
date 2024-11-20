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
        // Ambil hash dari URL (berisi token)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (!accessToken) {
          throw new Error('Tidak ada access token');
        }

        // Set session dengan token yang diterima
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });

        if (error) throw error;

        if (data.session) {
          toast.success('Login berhasil!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error dalam callback auth:', error);
        toast.error('Gagal menyelesaikan proses login');
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