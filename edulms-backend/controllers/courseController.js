import Course from '../models/Course.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('teacherId', 'name email avatar')
      .sort({ createdAt: -1 });

    // ✅ teacherId-г string хэлбэрээр илгээх
    const coursesWithStringIds = courses.map(course => ({
      ...course._doc,
      id: course._id.toString(),
      teacherId: course.teacherId?._id?.toString() || course.teacherId?.toString()
    }));

    res.json({
      success: true,
      courses: coursesWithStringIds
    });
  } catch (error) {
    console.error('Хичээлүүд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээлүүд авахад алдаа гарлаа'
    });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacherId', 'name email avatar phone');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Хичээл авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээл авахад алдаа гарлаа'
    });
  }
};
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      price,
      courseCategory,
      allowedRoles,
      bundleLinks,
      isPaid,
      teacherImage
    } = req.body;

    console.log('Received bundleLinks:', bundleLinks);
    console.log('Type of bundleLinks:', typeof bundleLinks);

    // Шалгалт
    if (!title || !description || !courseCategory) {
      return res.status(400).json({
        success: false,
        message: 'Бүх шаардлагатай талбаруудыг бөглөнө үү'
      });
    }

    // bundleLinks-ыг шалгах
    let processedBundleLinks = [];
    if (bundleLinks && Array.isArray(bundleLinks)) {
      processedBundleLinks = bundleLinks.map((link, index) => ({
        title: link.title || `Линк ${index + 1}`,
        url: link.url || '#'
      }));
    } else {
      console.error('bundleLinks is not array:', bundleLinks);
    }

    console.log('Processed bundleLinks:', processedBundleLinks);

    const courseData = {
      title,
      description,
      thumbnail,
      price: isPaid ? price : 0,
      teacherId: req.user.id,
      teacher: req.user.id,
      teacherName: req.user.name,
      teacherImage,
      courseCategory,
      courseType: 'bundle',
      allowedRoles: allowedRoles || ['student'],
      bundleLinks: processedBundleLinks,
      isPaid: isPaid || false,
      isActive: true
    };

    console.log('Final course data:', courseData);

    const course = await Course.create(courseData);

    const populatedCourse = await Course.findById(course._id)
      .populate('teacherId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Хичээл амжилттай үүсгэгдлээ',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Хичээл үүсгэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээл үүсгэхэд алдаа гарлаа'
    });
  }
};
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    // Зөвшөөрөл шалгах
    if (req.user.role !== 'admin' && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Энэ хичээлийг засах эрхгүй байна'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('teacherId', 'name email');

    res.json({
      success: true,
      message: 'Хичээл амжилттай шинэчлэгдлээ',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Хичээл шинэчлэх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээл шинэчлэхэд алдаа гарлаа'
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    // Зөвшөөрөл шалгах
    if (req.user.role !== 'admin' && course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Энэ хичээлийг устгах эрхгүй байна'
      });
    }

    await Course.findByIdAndUpdate(
      courseId,
      { isActive: false, updatedAt: new Date() }
    );

    res.json({
      success: true,
      message: 'Хичээл амжилттай устгагдлаа'
    });
  } catch (error) {
    console.error('Хичээл устгах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хичээл устгахад алдаа гарлаа'
    });
  }
};

export const updateCoursePrice = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { price } = req.body;
    
    if (price === undefined || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Зөв үнэ оруулна уу'
      });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { 
        price,
        isPaid: price > 0,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('teacherId', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Хичээл олдсонгүй'
      });
    }

    res.json({
      success: true,
      message: `Хичээлийн үнэ амжилттай ${price}₮ болж өөрчлөгдлөө`,
      course
    });
  } catch (error) {
    console.error('Үнэ өөрчлөх алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Үнэ өөрчлөхөд алдаа гарлаа'
    });
  }
};

export const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      teacherId: req.user.id,
      isActive: true 
    })
    .populate('teacherId', 'name email')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Миний хичээлүүд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Миний хичээлүүд авахад алдаа гарлаа'
    });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const { query } = req.params;
    
    const courses = await Course.find({
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { courseCategory: { $regex: query, $options: 'i' } },
        { teacherName: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('teacherId', 'name email')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
      query
    });
  } catch (error) {
    console.error('Хайлтын алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Хайлт хийхэд алдаа гарлаа'
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('courseCategory', { isActive: true });
    
    res.json({
      success: true,
      categories: categories.filter(Boolean).sort()
    });
  } catch (error) {
    console.error('Ангилалууд авах алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Ангилалууд авахад алдаа гарлаа'
    });
  }
};