import * as tf from '@tensorflow/tfjs-node';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

interface ProductPrediction {
  productId: string;
  name: string;
  confidence: number;
  quantity: number;
}

// Mapping kategori COCO-SSD ke produk
const productMapping: Record<string, string> = {
  'bottle': 'Minuman',
  'cup': 'Minuman',
  'bowl': 'Makanan',
  'sandwich': 'Makanan',
  'orange': 'Buah',
  'apple': 'Buah',
  'banana': 'Buah',
  'carrot': 'Sayuran',
  // Tambahkan mapping lainnya sesuai kebutuhan
};

export async function detectProducts(imageBuffer: Buffer): Promise<ProductPrediction[]> {
  try {
    // Load model
    const model = await cocoSsd.load();

    // Convert buffer ke tensor
    const image = await tf.node.decodeImage(imageBuffer);
    
    // Deteksi objek
    const predictions = await model.detect(image as any);

    // Filter dan transform hasil
    const products = predictions
      .filter(pred => pred.score > 0.5) // Minimal confidence 50%
      .filter(pred => productMapping[pred.class]) // Filter hanya produk yang ada di mapping
      .map(pred => ({
        productId: `${pred.class}_${Date.now()}`, // Generate simple ID
        name: productMapping[pred.class],
        confidence: pred.score,
        quantity: 1
      }));

    // Cleanup
    tf.dispose(image);

    return products;

  } catch (error) {
    console.error('AI Detection error:', error);
    throw new Error('Failed to process image');
  }
}

// Fungsi untuk mengoptimalkan gambar sebelum proses
export async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const image = await tf.node.decodeImage(imageBuffer);
    
    // Resize ke ukuran yang lebih kecil jika terlalu besar
    const resized = tf.image.resizeBilinear(image as any, [640, 640]);
    
    // Normalize pixel values
    const normalized = resized.div(255);
    
    // Convert back to buffer
    const uint8Array = await tf.node.encodePng(normalized);
    const processedBuffer = Buffer.from(uint8Array);
    
    // Cleanup
    tf.dispose([image, resized, normalized]);
    
    return processedBuffer;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    throw new Error('Failed to preprocess image');
  }
} 