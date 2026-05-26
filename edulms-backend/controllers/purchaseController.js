import Purchase from '../models/Purchase.js';
import Course from '../models/Course.js';

export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id, status: 'completed' })
      .populate('courseId')
      .sort({ purchasedAt: -1 });

    res.json({
      success: true,
      purchases
    });
  } catch (error) {
    console.error('Худалдан авалтууд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Худалдан авалтууд авахад алдаа гарлаа'
    });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const { courseId, amount, paymentMethod } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    // Үнэ шалгах
    if (course.price !== amount) {
      return res.status(400).json({
        success: false,
        message: 'Үнэ буруу байна'
      });
    }

    // Худалдан авалт үүсгэх
    const purchase = await Purchase.create({
      userId: req.user.id,
      courseId,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('courseId')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Худалдан авалт амжилттай',
      purchase: populatedPurchase
    });
  } catch (error) {
    console.error('Худалдан авалт үүсгэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Худалдан авалт үүсгэхэд алдаа гарлаа'
    });
  }
};