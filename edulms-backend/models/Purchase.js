import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: { type: String },
  transactionId: { type: String },
  purchasedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Purchase', PurchaseSchema);