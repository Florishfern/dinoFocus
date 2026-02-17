const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/my-dinos', authMiddleware, petController.getMyDinosByRarity);
router.post('/select', authMiddleware, petController.selectActivePet);
router.post('/gacha', authMiddleware, petController.gachaRoll);
// อย่าลืม import authMiddleware มาใช้ด้วยนะครับ
router.get('/active', authMiddleware, petController.getActivePet);

module.exports = router;