import Notification from '../models/Notification.js';
import UserNotification from '../models/UserNotification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Send notification
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, recipients, specificRecipients, schedule, scheduledTime } = req.body;
    const sender = req.user.id;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Гарчиг болон мессеж шаардлагатай'
      });
    }

    // Create notification
    const notification = new Notification({
      title,
      message,
      type: type || 'info',
      recipients: recipients || 'all',
      specificRecipients: specificRecipients || [],
      sender,
      scheduled: schedule || false,
      scheduledTime: scheduledTime || null,
      status: (schedule && scheduledTime) ? 'scheduled' : 'sent'
    });

    await notification.save();

    // If not scheduled, send immediately
    if (!schedule) {
      await sendNotificationToUsers(notification);
    }

    res.status(201).json({
      success: true,
      message: 'Мэдэгдэл амжилттай илгээгдлээ',
      notification
    });

  } catch (error) {
    console.error('Мэдэгдэл илгээх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Мэдэгдэл илгээхэд алдаа гарлаа'
    });
  }
};

// Get user's notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unread } = req.query;

    const query = { user: userId };
    if (unread === 'true') {
      query.read = false;
    }

    const notifications = await UserNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('notification', 'type scheduledTime');

    const total = await UserNotification.countDocuments(query);
    const unreadCount = await UserNotification.countDocuments({ 
      user: userId, 
      read: false 
    });

    res.json({
      success: true,
      notifications,
      total,
      unreadCount,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Мэдэгдэл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Мэдэгдэл авахад алдаа гарлаа'
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const userNotification = await UserNotification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { 
        read: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!userNotification) {
      return res.status(404).json({
        success: false,
        message: 'Мэдэгдэл олдсонгүй'
      });
    }

    // Update read count in main notification
    await Notification.findByIdAndUpdate(
      userNotification.notification,
      { $inc: { 'deliveryStats.readCount': 1 } }
    );

    res.json({
      success: true,
      message: 'Мэдэгдэл уншсан тэмдэглэгдлээ',
      notification: userNotification
    });

  } catch (error) {
    console.error('Мэдэгдэл унших тэмдэглэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Мэдэгдэл тэмдэглэхэд алдаа гарлаа'
    });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await UserNotification.updateMany(
      { user: userId, read: false },
      { 
        read: true, 
        readAt: new Date() 
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} мэдэгдэл уншсан тэмдэглэгдлээ`,
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Бүх мэдэгдэл унших тэмдэглэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Мэдэгдэл тэмдэглэхэд алдаа гарлаа'
    });
  }
};

// Get sent notifications (for admin/teachers)
export const getSentNotifications = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ sender: senderId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender', 'name email')
      .populate('specificRecipients', 'name email');

    const total = await Notification.countDocuments({ sender: senderId });

    res.json({
      success: true,
      notifications,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Илгээсэн мэдэгдэл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Илгээсэн мэдэгдэл авахад алдаа гарлаа'
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      _id: notificationId,
      sender: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Мэдэгдэл олдсонгүй'
      });
    }

    // Delete user notifications
    await UserNotification.deleteMany({ notification: notificationId });
    
    // Delete main notification
    await Notification.findByIdAndDelete(notificationId);

    res.json({
      success: true,
      message: 'Мэдэгдэл амжилттай устгагдлаа'
    });

  } catch (error) {
    console.error('Мэдэгдэл устгах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Мэдэгдэл устгахад алдаа гарлаа'
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalSent = await Notification.countDocuments({ sender: userId });
    const totalReceived = await UserNotification.countDocuments({ user: userId });
    const unreadCount = await UserNotification.countDocuments({ 
      user: userId, 
      read: false 
    });

    res.json({
      success: true,
      stats: {
        totalSent,
        totalReceived,
        unreadCount
      }
    });

  } catch (error) {
    console.error('Статистик авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Статистик авахад алдаа гарлаа'
    });
  }
};

// Helper function to send notification to users
async function sendNotificationToUsers(notification) {
  try {
    let userQuery = {};
    
    // Build query based on recipients
    switch (notification.recipients) {
      case 'students':
        userQuery.role = 'student';
        break;
      case 'teachers':
        userQuery.role = 'teacher';
        break;
      case 'admins':
        userQuery.role = 'admin';
        break;
      case 'specific':
        userQuery._id = { $in: notification.specificRecipients };
        break;
      case 'all':
      default:
        // No filter for all users
        break;
    }

    const users = await User.find(userQuery).select('_id name');
    
    // Create user notifications
    const userNotifications = users.map(user => ({
      user: user._id,
      notification: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      from: 'Систем Админ'
    }));

    await UserNotification.insertMany(userNotifications);

    // Update delivery stats
    notification.deliveryStats.sentCount = users.length;
    notification.status = 'sent';
    await notification.save();

    console.log(`✅ Мэдэгдэл ${users.length} хэрэглэгчдэд илгээгдлээ`);

  } catch (error) {
    console.error('Мэдэгдэл хэрэглэгчдэд илгээх алдаа:', error);
    
    // Update notification status to failed
    notification.status = 'failed';
    await notification.save();
  }
}