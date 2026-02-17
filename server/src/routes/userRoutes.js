const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/balance', authMiddleware, userController.getBalance);
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile/update', authMiddleware, userController.updateProfile);
router.get('/majors/list', authMiddleware, userController.getMajorsList);

module.exports = router;