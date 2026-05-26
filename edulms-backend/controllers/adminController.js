import User from '../models/User.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import TeacherRequest from '../models/TeacherRequest.js';

export const getStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalCourses,
      totalPurchases,
      totalRevenue,
      pendingRequests
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isActive: true }),
      Purchase.countDocuments({ status: 'completed' }),
      Purchase.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      TeacherRequest.countDocuments({ status: 'pending' })
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    res.json({
      success: true,
      statistics: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalCourses,
        totalPurchases,
        totalRevenue: revenue,
        pendingRequests,
        averageCoursePrice: totalCourses > 0 ? revenue / totalCourses : 0
      }
    });
  } catch (error) {
    console.error('Статистик авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Статистик авахад алдаа гарлаа'
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
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

export const getTeacherRequests = async (req, res) => {
  try {
    console.log('🔍 Багшийн хүсэлтүүдийг авах...');
    
    const requests = await TeacherRequest.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    console.log('✅ Олдсон хүсэлтүүд:', requests.length);

    const formattedRequests = requests.map(request => {
      const userInfo = request.userId || {};
      
      return {
        _id: request._id,
        userName: request.userName || userInfo.name || 'Нэр олдсонгүй',
        userEmail: request.userEmail || userInfo.email || 'Имэйл олдсонгүй',
        message: request.message || 'Тайлбар байхгүй',
        status: request.status,
        createdAt: request.createdAt,
        userId: request.userId?._id || 'ID олдсонгүй'
      };
    });

    console.log('📋 Боловсруулсан хүсэлтүүд:', formattedRequests);

    res.json({
      success: true,
      requests: formattedRequests
    });
  } catch (error) {
    console.error('❌ Багшийн хүсэлтүүд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Багшийн хүсэлтүүд авахад алдаа гарлаа'
    });
  }
};

export const approveTeacherRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('✅ Багшийн хүсэлт баталгаажуулж байна:', { requestId: id });

    const request = await TeacherRequest.findById(id);
    if (!request) {
      console.log('❌ Хүсэлт олдсонгүй:', id);
      return res.status(404).json({
        success: false,
        message: 'Хүсэлт олдсонгүй'
      });
    }

    console.log('📋 Хүсэлт олдлоо:', {
      requestId: request._id,
      userId: request.userId,
      userName: request.userName
    });

    console.log('🔍 Хэрэглэгч хайж байна...');
    const user = await User.findById(request.userId.toString());
    console.log('Хэрэглэгч хайлтын үр дүн:', user);

    if (!user) {
      console.log('❌ Хэрэглэгч олдсонгүй. Бүх хэрэглэгчдийг харъя:');
      const allUsers = await User.find({});
      console.log('Бүх хэрэглэгчид:', allUsers.map(u => ({ id: u._id, name: u.name, email: u.email })));
      
      return res.status(404).json({
        success: false,
        message: 'Хүсэлттэй холбоотой хэрэглэгч олдсонгүй'
      });
    }

    console.log('👤 Хэрэглэгч олдлоо:', {
      userId: user._id,
      userName: user.name,
      currentRole: user.role,
      currentApproved: user.isApproved
    });

    user.role = 'teacher';
    user.isApproved = true;
    await user.save();

    console.log('✅ Хэрэглэгч шинэчлэгдлээ:', {
      newRole: user.role,
      newApproved: user.isApproved
    });

    request.status = 'approved';
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    await request.save();

    console.log('🎉 Хүсэлт баталгаажлаа:', request._id);

    res.json({
      success: true,
      message: 'Багшийн хүсэлт амжилттай батлагдлаа',
      request: {
        _id: request._id,
        userName: request.userName,
        userEmail: request.userEmail,
        status: request.status,
        reviewedAt: request.reviewedAt
      }
    });

  } catch (error) {
    console.error('❌ Багшийн хүсэлт баталгаажуулах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Багшийн хүсэлт баталгаажуулахад алдаа гарлаа'
    });
  }
};

export const denyTeacherRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await TeacherRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Хүсэлт олдсонгүй'
      });
    }

    request.status = 'denied';
    await request.save();

    res.json({
      success: true,
      message: 'Бүртгэлийн хүсэлт амжилттай татгалзлаа',
      request
    });
  } catch (error) {
    console.error('Бүртгэлийн хүсэлт татгалзах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Бүртгэлийн хүсэлт татгалзахад алдаа гарлаа'
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Буруу роль'
      });
    }

    const user = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: 'Хэрэглэгчийн роль амжилттай шинэчлэгдлээ',
      user
    });
  } catch (error) {
    console.error('Хэрэглэгчийн роль шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хэрэглэгчийн роль шинэчлэхэд алдаа гарлаа'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
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

// ШИНЭ НЭМЭЛТҮҮД ЭНД ЭХЭЛНЭ

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    const formattedCourses = courses.map(course => ({
      _id: course._id,
      id: course._id,
      title: course.title || 'Нэр олдсонгүй',
      teacherName: course.teacher?.name || 'Багш олдсонгүй',
      teacherEmail: course.teacher?.email || '',
      price: course.price || 0,
      isActive: course.isActive !== false,
      createdAt: course.createdAt,
      students: course.students || []
    }));

    res.json({
      success: true,
      courses: formattedCourses
    });
  } catch (error) {
    console.error('Хичээл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээл авахад алдаа гарлаа'
    });
  }
};

export const updateCoursePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Үнэ буруу байна'
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { price },
      { new: true }
    ).populate('teacher', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: 'Хичээлийн үнэ амжилттай шинэчлэгдлээ',
      course: {
        _id: course._id,
        id: course._id,
        title: course.title,
        teacherName: course.teacher?.name,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Хичээлийн үнэ шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээлийн үнэ шинэчлэхэд алдаа гарлаа'
    });
  }
};

export const getPaymentRequests = async (req, res) => {
  try {
    const payments = await Purchase.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    const formattedPayments = payments.map(payment => ({
      _id: payment._id,
      id: payment._id,
      userName: payment.user?.name || 'Хэрэглэгч олдсонгүй',
      userEmail: payment.user?.email || '',
      courseTitle: payment.course?.title || 'Хичээл олдсонгүй',
      amount: payment.amount || 0,
      status: payment.status || 'pending',
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }));

    res.json({
      success: true,
      payments: formattedPayments
    });
  } catch (error) {
    console.error('Төлбөрийн хүсэлт авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Төлбөрийн хүсэлт авахад алдаа гарлаа'
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Буруу статус'
      });
    }

    const payment = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('course', 'title');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Төлбөрийн хүсэлт олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: 'Төлбөрийн статус амжилттай шинэчлэгдлээ',
      payment: {
        _id: payment._id,
        userName: payment.user?.name,
        courseTitle: payment.course?.title,
        amount: payment.amount,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Төлбөрийн статус шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Төлбөрийн статус шинэчлэхэд алдаа гарлаа'
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: `Хэрэглэгч ${isActive ? 'идэвхжүүлэгдлээ' : 'идэвхгүй боллоо'}`,
      user
    });
  } catch (error) {
    console.error('Хэрэглэгчийн статус шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хэрэглэгчийн статус шинэчлэхэд алдаа гарлаа'
    });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).populate('teacher', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: `Хичээл ${isActive ? 'идэвхжүүлэгдлээ' : 'идэвхгүй боллоо'}`,
      course: {
        _id: course._id,
        title: course.title,
        teacherName: course.teacher?.name,
        isActive: course.isActive
      }
    });
  } catch (error) {
    console.error('Хичээлийн статус шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээлийн статус шинэчлэхэд алдаа гарлаа'
    });
  }
};