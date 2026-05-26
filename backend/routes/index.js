const express = require('express');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

// ==========================================
// Authentication Routes (Public)
// ==========================================

// User Registration
router.post('/auth/register', registerValidator, register);

// User Login
router.post('/auth/login', loginValidator, login);

// ==========================================
// Task Management Routes (Protected by JWT)
// ==========================================

// Get all tasks (supports query param filtering: stage, priority, search)
router.get('/tasks', protect, getTasks);

// Create a new task
router.post('/tasks', protect, createTask);

// Update a task (update details or move stage)
router.put('/tasks/:id', protect, updateTask);

// Delete a task
router.delete('/tasks/:id', protect, deleteTask);

module.exports = router;
