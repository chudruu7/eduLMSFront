import express from 'express';
import { 
  getStatistics,
  getAllUsers,
  getTeacherRequests,
  approveTeacherRequest,
  denyTeacherRequest,
  updateUserRole,
  deleteUser 
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/statistics', authMiddleware, adminMiddleware, getStatistics);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/teacher-requests', authMiddleware, adminMiddleware, getTeacherRequests);
router.post('/teacher-requests/:id/approve', authMiddleware, adminMiddleware, approveTeacherRequest);
router.post('/teacher-requests/:id/deny', authMiddleware, adminMiddleware, denyTeacherRequest);
router.put('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;