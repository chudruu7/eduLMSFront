import mongoose from 'mongoose';

const bundleLinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  teacherImage: {
    type: String
  },
  thumbnail: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  courseCategory: {
    type: String,
    required: true
  },
  courseType: {
    type: String,
    default: 'bundle'
  },
  allowedRoles: [{
    type: String,
    default: ['student']
  }],
  bundleLinks: [bundleLinkSchema],
  isPaid: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Хуучин schema-г устгаж, шинээр үүсгэх
delete mongoose.connection.models['Course'];

const Course = mongoose.model('Course', courseSchema);
export default Course;