import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCoursePrice,
  getTeacherCourses,
  searchCourses,
  getCategories
} from '../controllers/courseController.js';
import { authMiddleware, adminMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);

// Protected routes
router.get('/', authMiddleware, getAllCourses);
router.get('/search/:query', authMiddleware, searchCourses);
router.get('/:id', authMiddleware, getCourseById);

// Teacher routes
router.get('/teacher/my-courses', authMiddleware, teacherMiddleware, getTeacherCourses);
router.post('/', authMiddleware, teacherMiddleware, createCourse);
router.put('/:id', authMiddleware, updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);

// Admin only routes
router.patch('/:id/price', authMiddleware, adminMiddleware, updateCoursePrice);

export default router;