import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../_shared/supabase';

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Basic validation
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Return dummy data for testing
    const dummyPredictions = [
      {
        productId: 'banana_1',
        name: 'Banana',
        confidence: 0.95,
        quantity: 1
      }
    ];

    // Send response
    return res.status(200).json({
      success: true,
      predictions: dummyPredictions
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to process image' 
    });
  }
});

export default router;