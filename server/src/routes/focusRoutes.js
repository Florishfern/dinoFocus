const express = require('express');
const router = express.Router();
const focusController = require('../controllers/focusController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, focusController.processFocusEnd);

module.exports = router;