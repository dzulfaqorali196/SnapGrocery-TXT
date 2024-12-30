import { useState } from 'react';
import { Camera, Loader2, Upload, Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface PredictionItem {
  productId: string;
  name: string;
  confidence: number;
  quantity: number;
}

export function ImageUpload() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleQuantityChange = (index: number, change: number) => {
    setPredictions(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const handleSaveList = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: predictions })
      });

      if (!response.ok) throw new Error('Gagal menyimpan daftar belanja');

      toast.success('Daftar belanja berhasil disimpan!');
      navigate('/shopping-lists');
    } catch (error) {
      toast.error('Gagal menyimpan daftar belanja');
      console.error('Error saving list:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload JPG or PNG image only');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload gambar
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('image', file);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        },
        body: formData
      });

      if (!response.ok) {
        console.error('Server response:', await response.text());
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setPredictions(data.predictions);
      toast.success('Image processed successfully!');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process image';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upload Product Image</h2>
        <p className="text-gray-600 mb-4">
          Upload a clear image of your grocery items and we'll help you create a shopping list.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={loading}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <span>{loading ? 'Processing...' : 'Upload Image'}</span>
            </div>
          </label>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {preview && (
          <div className="mt-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {predictions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Detected Items</h3>
            <ul className="space-y-2">
              {predictions.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSaveList}
              disabled={loading}
              className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Save Shopping List
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 