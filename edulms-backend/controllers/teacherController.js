import TeacherRequest from '../models/TeacherRequest.js';
import TeacherProfile from '../models/TeacherProfile.js';
import User from '../models/User.js';

export const getRegistrationRequests = async (req, res) => {
  try {
    const requests = await TeacherRequest.find({ status: 'pending' })
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Багшийн хүсэлтүүд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Багшийн хүсэлтүүд авахад алдаа гарлаа'
    });
  }
};

export const approveRegistrationRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await TeacherRequest.findById(requestId)
      .populate('userId');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Хүсэлт олдсонгүй'
      });
    }

    // Хэрэглэгчийн роль өөрчлөх
    await User.findByIdAndUpdate(request.userId._id, {
      role: 'teacher',
      isApproved: true,
      updatedAt: new Date()
    });

    // Teacher profile үүсгэх
    await TeacherProfile.findOneAndUpdate(
      { userId: request.userId._id },
      {
        userId: request.userId._id,
        userName: request.userName,
        userEmail: request.userEmail,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Хүсэлтийн статус өөрчлөх
    request.status = 'approved';
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Багшийн хүсэлт амжилттай батлагдлаа',
      request
    });
  } catch (error) {
    console.error('Хүсэлт баталгаажуулах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хүсэлт баталгаажуулахад алдаа гарлаа'
    });
  }
};

export const denyRegistrationRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await TeacherRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Хүсэлт олдсонгүй'
      });
    }

    request.status = 'denied';
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Багшийн хүсэлт цуцлагдлаа',
      request
    });
  } catch (error) {
    console.error('Хүсэлт цуцлах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хүсэлт цуцлахад алдаа гарлаа'
    });
  }
};

export const getAllTeacherProfiles = async (req, res) => {
  try {
    const profiles = await TeacherProfile.find({ isActive: true })
      .populate('userId', 'name email role')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      profiles
    });
  } catch (error) {
    console.error('Багшийн профайлууд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Багшийн профайлууд авахад алдаа гарлаа'
    });
  }
};

export const getMyTeacherProfile = async (req, res) => {
  try {
    let profile = await TeacherProfile.findOne({ userId: req.user.id })
      .populate('userId', 'name email role');

    if (!profile) {
      // Хэрэв профайл байхгүй бол үүсгэх
      profile = await TeacherProfile.create({
        userId: req.user.id,
        userName: req.user.name,
        userEmail: req.user.email
      });
      profile = await TeacherProfile.findById(profile._id)
        .populate('userId', 'name email role');
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Багшийн профайл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Багшийн профайл авахад алдаа гарлаа'
    });
  }
};

export const updateTeacherProfile = async (req, res) => {
  try {
    const {
      avatar,
      nickname,
      gender,
      country,
      subject,
      phone,
      facebook,
      instagram,
      github,
      lessonImage,
      categories,
      bio,
      experience,
      education
    } = req.body;

    const profile = await TeacherProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        avatar,
        nickname,
        gender,
        country,
        subject,
        phone,
        facebook,
        instagram,
        github,
        lessonImage,
        categories,
        bio,
        experience,
        education,
        updatedAt: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('userId', 'name email role');

    // Хэрэв phone өөрчлөгдвөл user-д ч өөрчлөх
    if (phone) {
      await User.findByIdAndUpdate(req.user.id, { phone });
    }

    res.json({
      success: true,
      message: 'Багшийн профайл амжилттай хадгалагдлаа',
      profile
    });
  } catch (error) {
    console.error('Багшийн профайл шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Багшийн профайл шинэчлэхэд алдаа гарлаа'
    });
  }
};