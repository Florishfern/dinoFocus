const db = require('../config/db');

exports.getBalance = async (req, res) => {
    try{
        const userId = req.user.id;

        const [user] = await db.promise().execute(
            `SELECT total_coins, total_xp FROM users WHERE user_id = ?`,
            [userId]
        );

        if(user.length === 0) return res.status(404).json({message: "User not found"});

        res.status(200).json({
            success: true,
            data: {
                coins: user[0].total_coins,
                xp: user[0].total_xp
            }
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getUserProfile = async (req, res) => {
    try{
        const userId = req.user.id;

        const [userData] = await db.promise().execute(
            `SELECT username, major, bio, profile_image, consecutive_days, total_coins, total_xp
            FROM users WHERE user_id = ?`,
            [userId]
        );

        if(userData.length === 0) return res.status(404).json({message: "User not found"});

        const [dinos] = await db.promise().execute(
            `SELECT c.image_url, c.dino_name
            FROM pets p
            JOIN dino_catalog c ON p.dino_id = c.dino_id
            WHERE p.user_id = ? LIMIT 10`,
            [userId]
        );

        const [focusStats] = await db.promise().execute(
            `SELECT SUM(fl.duration_minutes) as total_minutes
            FROM focus_logs fl
            JOIN tasks t ON fl.task_id = t.task_id
            WHERE fl.user_id = ? 
            AND MONTH(t.created_at) = MONTH(CURRENT_DATE())
            AND YEAR(t.created_at) = YEAR(CURRENT_DATE())`,
            [userId]
        );

        const [taskStats] = await db.promise().execute(
            `SELECT
                COUNT(CASE WHEN is_completed = 1 THEN 1 END) as success_count,
                COUNT(CASE WHEN is_completed = 0 THEN 1 END) as fail_count
            FROM tasks
            WHERE user_id = ? 
            AND MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
            [userId] 
        );

        const totalMin = focusStats[0].total_minutes || 0;
        const hours = Math.floor(totalMin/60);
        const mins = totalMin % 60;
        const formattedTime = `${hours}h ${mins}m`;

        res.status(200).json({
            success: true,
            data: {
                profile: userData[0],
                dino_collection: dinos,
                summary: {
                    monthly_focus: formattedTime,
                    Task_success: taskStats[0].success_count || 0,
                    task_fail: taskStats[0].fail_count || 0,
                }
            }
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const {username, bio, major, profile_image} = req.body;

        const [rows] = await db.promise().execute(
            `SELECT username, bio, major, profile_image FROM users WHERE user_id = ?`,
            [userId]
        );

        const current = rows[0];

        await db.promise().execute(
            `UPDATE users
            SET username = ?, bio = ?, major = ?, profile_image = ?
            WHERE user_id = ?`,
            [
                username !== undefined ? username: current.username, 
                bio !== undefined ? bio: current.bio, 
                major !== undefined ? major: current.major, 
                profile_image !== undefined ? profile_image: current.profile_image, 
                userId
            ]
        );

        res.status(200).json({
            success: true,
            message: "Update profile success!",
            data: {username, bio, major, profile_image}
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getMajorsList = async (req, res) => {
    try{
        const [rows] = await db.promise().execute(
            `SELECT major_name FROM majors_catalog ORDER BY major_name ASC`
        );

        res.status(200).json({
            succcess: true,
            data: rows.map(r => r.major_name)
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

