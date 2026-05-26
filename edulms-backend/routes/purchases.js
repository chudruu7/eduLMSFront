import express from 'express';
import {
  getMyPurchases,
  createPurchase
} from '../controllers/purchaseController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/my-purchases', authMiddleware, getMyPurchases);
router.post('/', authMiddleware, createPurchase);

export default router;