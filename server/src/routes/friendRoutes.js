const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search', authMiddleware, friendController.searchUsers);
router.post('/add-friend', authMiddleware, friendController.addFriend);
router.patch('/accept-friend', authMiddleware, friendController.acceptFriendRequest);
router.get('/requests', authMiddleware, friendController.getFriendRequests);
router.get('/list', authMiddleware, friendController.getFriendList);
router.get('/leaderboard', authMiddleware, friendController.getTopFocusByMajor);

module.exports = router;