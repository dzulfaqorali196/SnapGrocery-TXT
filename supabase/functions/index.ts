import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { detectProducts } from './_shared/ai';
import shoppingListsRouter from './shopping-lists';
import processImageRouter from './process-image';

const app = express();
const port = 3000;

// Tipe untuk request dengan file
interface FileRequest extends Request {
  file?: Express.Multer.File
}

// Multer config
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// CORS config
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/shopping-lists', shoppingListsRouter);
app.use('/api/process-image', processImageRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app; 