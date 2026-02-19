const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/tasks', protect, taskController.createTask);
router.get('/tasks', protect, taskController.getAllTasks);
//register route
router.post('/register', taskController.register); 
//login route
router.post('/login', taskController.login);

module.exports = router;