const db = require('../config/db');

exports.searchUsers = async (req, res) => {
    try{
        const {username} = req.query;
        const [users] = await db.promise().execute(
            `SELECT user_id, username, major, profile_image
            FROM users
            WHERE username LIKE ? AND user_id != ?`,
            [`%${username}%`, req.user.id]
        );
        res.status(200).json({success: true, data:users});
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.addFriend = async (req, res) => {
    try{
        const {receiver_id} = req.body;
        const requester_id = req.user.id;

        await db.promise().execute(
            `INSERT INTO friends (requester_id, receiver_id, status)
            VALUES (?, ?, 'PENDING')`,
            [requester_id, receiver_id]
        );
        
        res.status(200).json({success: true, message: "Friend request sent!"});
    } catch (err){
        res.status(500).json({error: err.message});    
    }
}

exports.acceptFriendRequest = async (req, res) => {
    try{
        const {requestId} = req.body;
        const userId = req.user.id;

        const [request] = await db.promise().execute(
            `SELECT * FROM friends WHERE id = ? AND receiver_id = ? AND status = 'PENDING'`,
            [requestId, userId]
        );

        if(request.length === 0){
            return res.status(404).json({messge: "Friend request not found or already processed"});
        }

        await db.promise().execute(
            `UPDATE friends SET status = 'ACCEPTED' WHERE id = ?`,
            [requestId]
        );

        res.status(200).json({
            success: true,
            message: "You are now friends!"
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

// ในไฟล์ controllers/friendController.js
exports.declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params; // ดึงจาก URL params
        const userId = req.user.id;

        await db.promise().execute(
            `DELETE FROM friends WHERE id = ? AND receiver_id = ?`,
            [requestId, userId]
        );

        res.status(200).json({ success: true, message: "Request declined" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFriendRequests = async (req, res) => {
    try{
        const userId = req.user.id;

        const [requests] = await db.promise().execute(
            `SELECT f.id AS requestId, u.user_id, u.username, u.major, u.profile_image, f.created_at
            FROM friends f
            JOIN users u ON f.requester_id = u.user_id
            WHERE f.receiver_id = ? AND f.status = 'PENDING'
            ORDER BY f.created_at DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getFriendList = async (req, res) => {
    try{
        const userId = req.user.id;
        const query = `
            SELECT 
                u.user_id, 
                u.username, 
                u.major, 
                u.profile_image
            FROM friends f 
            JOIN users u ON (f.requester_id = u.user_id OR f.receiver_id = u.user_id)
            WHERE (f.requester_id = ? OR f.receiver_id = ?) 
            AND f.status = 'ACCEPTED' 
            AND u.user_id != ?
        `; 

        const [friends] = await db.promise().execute(query, [userId, userId, userId]);

        res.status(200).json({success: true, data: friends});
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getGlobalTopFocus = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id,
                u.username, 
                u.major,
                u.profile_image,
                u.consecutive_days as streaks -- ดึงจากตาราง users โดยตรง
            FROM users u
            ORDER BY u.consecutive_days DESC
            LIMIT 3
        `;

        const [topUsers] = await db.promise().execute(query);

        res.status(200).json({
            success: true,
            title: "Today Top Focus",
            data: topUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
