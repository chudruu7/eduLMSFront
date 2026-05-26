import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TeacherRequest from '../models/TeacherRequest.js';

const JWT_SECRET = process.env.JWT_SECRET || 'edulms-secret-key';

// Бүх функцийг export хийх
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, bio } = req.body;

    console.log('🔐 Бүртгэл хүсэлт ирлээ:', { name, email, role });

    // Хэрэглэгч бүртгэлтэй эсэхийг шалгах
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Энэ имэйлээр хэрэглэгч бүртгэлтэй байна'
      });
    }

    // Багшаар бүртгүүлбэл isApproved: false болгох
    const isApproved = role !== 'teacher';

    // Шинэ хэрэглэгч үүсгэх
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone: phone || '',
      bio: bio || '',
      isApproved: isApproved
    });

    console.log('✅ Хэрэглэгч үүслээ:', { 
      id: user._id, 
      name: user.name,
      role: user.role, 
      isApproved: user.isApproved 
    });

    // Багшаар бүртгүүлбэл TeacherRequest ҮҮСГЭХ
    if (role === 'teacher') {
      try {
        console.log('👨‍🏫 Багшийн хүсэлт үүсгэж байна...');
        
        const teacherRequest = await TeacherRequest.create({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          message: bio || `${user.name} багшаар бүртгүүлэх хүсэлт`,
          status: 'pending'
        });

        console.log('✅ TeacherRequest амжилттай үүслээ:', {
          requestId: teacherRequest._id,
          userName: teacherRequest.userName,
          userEmail: teacherRequest.userEmail
        });

      } catch (teacherRequestError) {
        console.error('❌ TeacherRequest үүсгэх алдаа:', teacherRequestError);
        
        // TeacherRequest үүсгэхэд алдаа гарвал хэрэглэгчийг устгах
        await User.findByIdAndDelete(user._id);
        
        return res.status(500).json({
          success: false,
          message: 'Багшийн хүсэлт үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.'
        });
      }
    }

    // Зөвхөн сурагч бүртгэл бол token үүсгэх
    let token = null;
    if (role === 'student') {
      token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    }

    const responseMessage = role === 'teacher' 
      ? 'Багшаар бүртгүүлэх хүсэлт илгээгдлээ! Админ баталгаажуулахыг хүлээнэ үү.' 
      : 'Амжилттай бүртгүүллээ!';

    console.log('🎉 Бүртгэл амжилттай:', responseMessage);

    res.status(201).json({
      success: true,
      message: responseMessage,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        isApproved: user.isApproved
      },
      token
    });

  } catch (error) {
    console.error('❌ Бүртгэлийн алдаа:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Бүртгэлд алдаа гарлаа'
    });
  }
};

// Нэвтрэх
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Нэвтрэх оролдлого:', { email });

    // Хэрэглэгч олдох эсэхийг шалгах
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Хэрэглэгч олдсонгүй:', email);
      return res.status(400).json({
        success: false,
        message: 'Имэйл эсвэл нууц үг буруу байна'
      });
    }

    console.log('Хэрэглэгч олдлоо:', { 
      id: user._id, 
      role: user.role, 
      isApproved: user.isApproved 
    });

    // Багш хэрэглэгч баталгаажаагүй бол
    if (user.role === 'teacher' && !user.isApproved) {
      console.log('Багш хэрэглэгч баталгаажаагүй:', user.email);
      return res.status(400).json({
        success: false,
        message: 'Таны багшийн эрх баталгаажаагүй байна. Админ баталгаажуулахыг хүлээнэ үү.'
      });
    }

    // Нууц үг шалгах
    console.log('Нууц үг шалгаж байна...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Нууц үг зөв эсэх:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Нууц үг буруу:', user.email);
      return res.status(400).json({
        success: false,
        message: 'Имэйл эсвэл нууц үг буруу байна'
      });
    }

    // Token үүсгэх
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    console.log('Нэвтрэх амжилттай:', user.email);

    res.json({
      success: true,
      message: 'Амжилттай нэвтэрлээ!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        isApproved: user.isApproved,
        avatar: user.avatar
      },
      token
    });

  } catch (error) {
    console.error('Нэвтрэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Нэвтрэхэд алдаа гарлаа'
    });
  }
};

// Гарах
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Амжилттай гарлаа'
    });
  } catch (error) {
    console.error('Гарах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Гарахад алдаа гарлаа'
    });
  }
};

// Профайл авах
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Профайл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Профайл авахад алдаа гарлаа'
    });
  }
};

// Профайл шинэчлэх
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, 
        email, 
        phone, 
        bio,
        avatar 
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: 'Профайл амжилттай шинэчлэгдлээ',
      user
    });

  } catch (error) {
    console.error('Профайл шинэчлэх алдаа:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Энэ имэйлээр бүртгэлтэй хэрэглэгч байна'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Профайл шинэчлэхэд алдаа гарлаа'
    });
  }
};

// Нууц үг солих
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    // Одоогийн нууц үг шалгах
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Одоогийн нууц үг буруу байна'
      });
    }

    // Шинэ нууц үг солих
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Нууц үг амжилттай солигдлоо'
    });

  } catch (error) {
    console.error('Нууц үг солих алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Нууц үг солиход алдаа гарлаа'
    });
  }
};