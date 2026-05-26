import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'edulms-secret-key';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Нэвтрэх эрх шаардлагатай. Токен оруулна уу.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Хэрэглэгч олдсонгүй. Дахин нэвтрэнэ үү.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Токен хүчингүй байна. Дахин нэвтрэнэ үү.' 
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Зөвхөн админ хэрэглэгч энэ үйлдлийг хийх эрхтэй' 
    });
  }
  next();
};

export const teacherMiddleware = (req, res, next) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Зөвхөн багш болон админ хэрэглэгч энэ үйлдлийг хийх эрхтэй' 
    });
  }
  next();
};

export const studentMiddleware = (req, res, next) => {
  if (req.user.role !== 'student' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Зөвхөн сурагч болон админ хэрэглэгч энэ үйлдлийг хийх эрхтэй' 
    });
  }
  next();
};