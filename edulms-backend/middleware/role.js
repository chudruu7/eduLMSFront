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