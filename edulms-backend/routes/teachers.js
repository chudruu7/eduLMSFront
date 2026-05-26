import express from 'express';
import {
    getRegistrationRequests,
    approveRegistrationRequest,
    denyRegistrationRequest,
    getAllTeacherProfiles,
    getMyTeacherProfile,
    updateTeacherProfile
} from '../controllers/teacherController.js';
import { authMiddleware, adminMiddleware, teacherMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router(); // ← нэг нэр ашиглана

// ✅ Багш нарын жагсаалт — TeacherCard.jsx дуудна
router.get('/', authMiddleware, async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher', isApproved: true })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({ success: true, teachers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Алдаа гарлаа' });
    }
});

// Public routes
router.get('/profiles', getAllTeacherProfiles);

// Teacher routes
router.get('/my-profile', authMiddleware, teacherMiddleware, getMyTeacherProfile);
router.put('/profiles', authMiddleware, teacherMiddleware, updateTeacherProfile);

// Admin only routes
router.get('/requests/registrations', authMiddleware, adminMiddleware, getRegistrationRequests);
router.patch('/requests/registrations/:id/approve', authMiddleware, adminMiddleware, approveRegistrationRequest);
router.patch('/requests/registrations/:id/deny', authMiddleware, adminMiddleware, denyRegistrationRequest);

export default router;