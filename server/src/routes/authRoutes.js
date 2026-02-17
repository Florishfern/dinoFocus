const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);


//Temporary route
router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({message: "Your are authenticated!", userData: req.user})
});

module.exports = router;