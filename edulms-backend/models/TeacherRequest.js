import mongoose from 'mongoose';

const teacherRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: 'Багшаар бүртгүүлэх хүсэлт'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Middleware: Хэрэглэгч устгагдвал харгалзах TeacherRequest-үүдийг устгах
teacherRequestSchema.pre('deleteMany', async function(next) {
  try {
    const conditions = this.getFilter();
    await TeacherRequest.deleteMany({ userId: conditions._id });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('TeacherRequest', teacherRequestSchema);