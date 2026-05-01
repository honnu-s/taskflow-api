const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
];

router.use(protect); 

router.route('/').get(getTasks).post(taskValidation, createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
