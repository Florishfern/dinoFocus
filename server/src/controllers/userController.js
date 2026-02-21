const db = require("../config/db");

// ฟังก์ชันคำนวณ Streak จาก focus_logs
const calculateStreak = async (userId) => {
  try {
    // Query นี้จะนับวันที่ต่อเนื่องกัน โดยไม่สนใจว่าวันหนึ่งจะทำกี่ครั้ง
    const [rows] = await db.promise().execute(
      `SELECT COUNT(*) as actual_streak
             FROM (
                SELECT DISTINCT DATE(start_time) as focus_date
                FROM focus_logs 
                WHERE user_id = ? AND duration_minutes > 0 -- หรือใส่เงื่อนไข task ที่สำเร็จ
             ) as days
             WHERE DATEDIFF(CURRENT_DATE(), focus_date) = (
                SELECT COUNT(*) 
                FROM (SELECT DISTINCT DATE(start_time) as d FROM focus_logs WHERE user_id = ?) as sub
                WHERE d >= days.focus_date
             ) - 1`,
      [userId, userId],
    );
    return rows[0].actual_streak || 0;
  } catch (err) {
    console.error("Streak Error:", err);
    return 0;
  }
};

exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user] = await db
      .promise()
      .execute(`SELECT total_coins, total_xp FROM users WHERE user_id = ?`, [
        userId,
      ]);

    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        coins: user[0].total_coins,
        xp: user[0].total_xp,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const streak = await calculateStreak(userId);

    const [userData] = await db.promise().execute(
      `SELECT username, major, bio, profile_image, consecutive_days, total_coins, total_xp
            FROM users WHERE user_id = ?`,
      [userId],
    );

    if (userData.length === 0)
      return res.status(404).json({ message: "User not found" });

    const [dinos] = await db.promise().execute(
      `SELECT c.image_url, c.dino_name
            FROM pets p
            JOIN dino_catalog c ON p.dino_id = c.dino_id
            WHERE p.user_id = ? LIMIT 10`,
      [userId],
    );

    const [taskSuccess] = await db.promise().execute(
      `SELECT COUNT(*) as count FROM tasks 
     WHERE user_id = ? AND is_completed = 1 
     AND MONTH(created_at) = MONTH(CURRENT_DATE())`,
      [userId],
    );

    // 2. Fail (นับจาก tasks)
    const [taskFail] = await db.promise().execute(
    `SELECT COUNT(*) as count FROM tasks 
     WHERE user_id = ? AND is_completed = 2
     AND MONTH(created_at) = MONTH(CURRENT_DATE())`, // เปลี่ยนจาก start_time เป็น created_at
    [userId]
);
    // 3. Time (รวมเวลาจาก focus_logs) - อันนี้ใช้ start_time ได้เพราะถูกตาราง
    const [focusTime] = await db.promise().execute(
      `SELECT SUM(duration_minutes) as total_minutes FROM focus_logs 
     WHERE user_id = ? AND is_completed = 1 
     AND MONTH(start_time) = MONTH(CURRENT_DATE())`,
      [userId],
    );

    const totalMin = focusTime[0].total_minutes || 0;
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    const formattedTime = `${hours}h ${mins}m`;

    res.status(200).json({
      success: true,
      data: {
        profile: { ...userData[0], consecutive_days: streak },
        dino_collection: dinos,
        summary: {
          monthly_focus: formattedTime,
          Task_success: taskSuccess[0].count || 0,
          task_fail: taskFail[0].count || 0,
        },
      },
    });
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, major, profile_image } = req.body;

    const [rows] = await db
      .promise()
      .execute(
        `SELECT username, bio, major, profile_image FROM users WHERE user_id = ?`,
        [userId],
      );

    const current = rows[0];

    await db.promise().execute(
      `UPDATE users
            SET username = ?, bio = ?, major = ?, profile_image = ?
            WHERE user_id = ?`,
      [
        username !== undefined ? username : current.username,
        bio !== undefined ? bio : current.bio,
        major !== undefined ? major : current.major,
        profile_image !== undefined ? profile_image : current.profile_image,
        userId,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Update profile success!",
      data: { username, bio, major, profile_image },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMajorsList = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .execute(`SELECT major_name FROM majors_catalog ORDER BY major_name ASC`);

    res.status(200).json({
      succcess: true,
      data: rows.map((r) => r.major_name),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
