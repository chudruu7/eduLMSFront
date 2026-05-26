import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// ES module-д __dirname-г тодорхойлох
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables ачаалах
dotenv.config();

console.log('🔧 Environment variables ачаалагдаж байна...');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI байна уу?', process.env.MONGODB_URI ? 'Тийм' : 'Үгүй');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB холболт
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edulms')
  .then(() => console.log('✅ MongoDB холбогдлоо'))
  .catch(err => {
    console.error('❌ MongoDB холбогдоход алдаа гарлаа:', err);
    process.exit(1);
  });

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import teacherRoutes from './routes/teachers.js';
import adminRoutes from './routes/admin.js';
import purchaseRoutes from './routes/purchases.js';
import notificationRoutes from './routes/notification.js';
import requestRoutes from './routes/requests.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/requests', requestRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер ажиллаж байна',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Алдаа:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Серверийн дотоод алдаа гарлаа'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint олдсонгүй'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж байна`);
  console.log(`📚 EDULMS Backend System бэлэн боллоо!`);
});