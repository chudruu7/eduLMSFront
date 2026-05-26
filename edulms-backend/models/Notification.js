import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'alert'],
    default: 'info'
  },
  recipients: {
    type: String,
    enum: ['all', 'students', 'teachers', 'admins', 'specific'],
    default: 'all'
  },
  specificRecipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduled: {
    type: Boolean,
    default: false
  },
  scheduledTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'failed'],
    default: 'sent'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveryStats: {
    sentCount: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);