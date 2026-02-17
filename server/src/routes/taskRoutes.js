const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks)
router.patch('/reorder', authMiddleware, taskController.reorderTasks);
router.patch('/:id/status', authMiddleware, taskController.updateTaskStatus);
router.delete('/:id', authMiddleware, taskController.deleteTask);
router.get('/summary', authMiddleware, taskController.getTaskSummary);
router.put('/:id', authMiddleware, taskController.updateTask);

module.exports = router;