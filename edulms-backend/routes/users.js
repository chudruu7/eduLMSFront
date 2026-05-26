import express from 'express';
import { 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  getMyProfile,      // ← нэмэх
  updateMyProfile    // ← нэмэх
} from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

// ✅ Profile routes - adminMiddleware ХЭРЭГГҮЙ, зөвхөн authMiddleware
router.get('/profile', getMyProfile);       // ← нэмэх
router.put('/profile', updateMyProfile);    // ← нэмэх
router.patch('/profile', updateMyProfile);  // ← нэмэх (frontend PATCH ашигладаг)

// Admin routes
router.get('/', adminMiddleware, getAllUsers);
router.put('/:id/role', adminMiddleware, updateUserRole);
router.delete('/:id', adminMiddleware, deleteUser);

export default router;