import User from '../models/User.js';
import TeacherProfile from '../models/TeacherProfile.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import bcrypt from 'bcryptjs';
export const getMyProfile = async (req, res) => {
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
      ...user.toObject()
    });
  } catch (error) {
    console.error('Профайл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Профайл авахад алдаа гарлаа'
    });
  }
};

// ✅ Өөрийн профайл шинэчлэх
export const updateMyProfile = async (req, res) => {
  try {
    const { name, email, password, avatar, phone, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: 'Профайл амжилттай шинэчлэгдлээ',
      user: userObj,
      ...userObj
    });
  } catch (error) {
    console.error('Профайл шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Профайл шинэчлэхэд алдаа гарлаа'
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Хэрэглэгчид авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хэрэглэгчид авахад алдаа гарлаа'
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;
    
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Зөв role сонгоно уу'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        role,
        isApproved: role === 'teacher' ? true : undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    // Хэрэв багш болгох бол teacher profile үүсгэх
    if (role === 'teacher') {
      const existingProfile = await TeacherProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        await TeacherProfile.create({
          userId: user._id,
          userName: user.name,
          userEmail: user.email
        });
      }
    }

    res.json({
      success: true,
      message: `Хэрэглэгчийн эрх амжилттай ${role} болж өөрчлөгдлөө`,
      user
    });
  } catch (error) {
    console.error('Role өөрчлөх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Role өөрчлөхөд алдаа гарлаа'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    // Өөрийгөө устгахгүй байх
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Өөрийн бүртгэлийг устгах боломжгүй'
      });
    }

    await User.findByIdAndDelete(userId);

    // Холбоотой өгөгдлүүдийг устгах
    await TeacherProfile.deleteOne({ userId: user._id });
    await Purchase.deleteMany({ userId: user._id });

    // Хэрэв багш бол хичээлүүдийг ч устгах
    if (user.role === 'teacher') {
      await Course.updateMany(
        { teacherId: user._id },
        { isActive: false }
      );
    }

    res.json({
      success: true,
      message: 'Хэрэглэгч амжилттай устгагдлаа'
    });
  } catch (error) {
    console.error('Хэрэглэгч устгах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хэрэглэгч устгахад алдаа гарлаа'
    });
  }
};