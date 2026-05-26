import express from 'express';
import { 
  sendNotification, 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  getSentNotifications, 
  deleteNotification, 
  getNotificationStats 
} from '../controllers/notificationController.js';
import { authMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Send notification (Admin and Teachers only)
router.post('/send', teacherMiddleware, sendNotification);

// Get user's notifications
router.get('/my-notifications', getUserNotifications);

// Mark as read
router.patch('/:notificationId/read', markAsRead);

// Mark all as read
router.patch('/read-all', markAllAsRead);

// Get sent notifications
router.get('/sent', getSentNotifications);

// Delete notification
router.delete('/:notificationId', deleteNotification);

// Get notification statistics
router.get('/stats', getNotificationStats);

export default router;