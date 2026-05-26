// EDULMS-BACKEND/routes/requests.js
import express from 'express';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

// GET /api/requests/payments
router.get('/payments', async (req, res) => {
    try {
        const payments = await Purchase.find()
            .populate('userId', 'name email')
            .populate('courseId', 'title price')
            .sort({ createdAt: -1 });

        res.json({ success: true, payments });
    } catch (error) {
        console.error('Payments error:', error);
        res.status(500).json({ success: false, message: 'Төлбөрийн мэдээлэл авахад алдаа' });
    }
});

// GET /api/requests/registrations
router.get('/registrations', async (req, res) => {
    try {
        const registrations = await User.find({ isApproved: false })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ success: true, registrations });
    } catch (error) {
        console.error('Registrations error:', error);
        res.status(500).json({ success: false, message: 'Бүртгэлийн мэдээлэл авахад алдаа' });
    }
});

// PATCH /api/requests/payments/:id/approve
router.patch('/payments/:id/approve', async (req, res) => {
    try {
        const purchase = await Purchase.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!purchase) return res.status(404).json({ success: false, message: 'Олдсонгүй' });
        res.json({ success: true, message: 'Төлбөр батлагдлаа', purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Батлахад алдаа гарлаа' });
    }
});

// PATCH /api/requests/payments/:id/deny
router.patch('/payments/:id/deny', async (req, res) => {
    try {
        const purchase = await Purchase.findByIdAndUpdate(
            req.params.id,
            { status: 'denied' },
            { new: true }
        );
        if (!purchase) return res.status(404).json({ success: false, message: 'Олдсонгүй' });
        res.json({ success: true, message: 'Төлбөр татгалзагдлаа', purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Татгалзахад алдаа гарлаа' });
    }
});

// PATCH /api/requests/registrations/:id/approve
router.patch('/registrations/:id/approve', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Олдсонгүй' });
        res.json({ success: true, message: 'Бүртгэл батлагдлаа', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Батлахад алдаа гарлаа' });
    }
});

// PATCH /api/requests/registrations/:id/deny
router.patch('/registrations/:id/deny', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Олдсонгүй' });
        res.json({ success: true, message: 'Бүртгэл татгалзагдлаа' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Татгалзахад алдаа гарлаа' });
    }
});

export default router;