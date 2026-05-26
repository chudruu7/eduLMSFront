import mongoose from 'mongoose';

const TeacherProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  avatar: { type: String },
  nickname: { type: String },
  gender: { type: String },
  country: { type: String },
  subject: { type: String },
  phone: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  github: { type: String },
  lessonImage: { type: String },
  categories: [{ type: String }],
  bio: { type: String },
  experience: { type: String },
  education: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TeacherProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('TeacherProfile', TeacherProfileSchema);