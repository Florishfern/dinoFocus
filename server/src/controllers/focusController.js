const db = require("../config/db");
const { calculateRandomReward } = require("../services/rewardService");
const { calculateLevelUp } = require("../services/petService");

exports.processFocusEnd = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      task_id,
      new_task_title,
      category_id,
      new_category_name,
      planned_minutes,
      actual_minutes,
    } = req.body;

    let finalTaskId = task_id;
    let finalCategoryId = category_id;

    if (!finalCategoryId && new_category_name) {
      const [newCat] = await db
        .promise()
        .execute(`INSERT INTO categories (name, user_id) VALUES (?, ?)`, [
          new_category_name,
          userId,
        ]);
      finalCategoryId = newCat.insertId;
    }

    let earnedCoins = 0;
    let earnedXP = 0;

    const completionRate = (actual_minutes / planned_minutes) * 100;

    if (completionRate >= 100) {
      earnedXP = 100;
    } else if (completionRate >= 70) {
      earnedXP = 70;
    } else if (completionRate >= 50) {
      earnedXP = 50;
    } else {
      earnedXP = 10;
    }

    const isCompletedFullTime = actual_minutes >= planned_minutes;
    const rewardItem = calculateRandomReward(isCompletedFullTime);

    if (rewardItem) {
      if (rewardItem.type === "FOOD") {
        earnedXP += rewardItem.amount;
      } else if (rewardItem.type === "COINS") {
        earnedCoins += rewardItem.amount;
      }
    }

    const [activePets] = await db
      .promise()
      .execute(
        `SELECT pets_id, level, exp FROM pets WHERE user_id = ? AND is_active = 1 LIMIT 1`,
        [userId],
      );

    let petResult = null;
    if (activePets.length > 0) {
      const currentPet = activePets[0];

      petResult = calculateLevelUp(currentPet.level, currentPet.exp, earnedXP);

      await db
        .promise()
        .execute(`UPDATE pets SET level = ?, exp = ? WHERE pets_id = ?`, [
          petResult.newLevel,
          petResult.newExp,
          currentPet.pets_id,
        ]);
    }

    const taskStatus = isCompletedFullTime ? 1 : 2;

    if (!task_id && new_task_title) {
      const [newTask] = await db.promise().execute(
        `INSERT INTO tasks (user_id, title, category_id, focus_time_spent, is_completed, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [userId, new_task_title, finalCategoryId || null, planned_minutes, taskStatus],
      );
      finalTaskId = newTask.insertId;
    } else if (task_id) {
      console.log(
        "Updating existing task:",
        task_id,
        "with category:",
        finalCategoryId,
      ); // เพิ่ม log ดูค่า
      await db.promise().execute(
        `UPDATE tasks 
            SET is_completed = ?, 
                category_id = IFNULL(?, category_id) 
            WHERE task_id = ? AND user_id = ?`,
        [ taskStatus, finalCategoryId, task_id, userId],
      );
    }

    await db.promise().execute(
      `INSERT INTO focus_logs (user_id, task_id, duration_minutes, start_time, end_time, is_completed)
            VALUES (?, ?, ?, NOW() - INTERVAL ? MINUTE, NOW(), ?)`,
      [userId, finalTaskId, actual_minutes, actual_minutes, taskStatus === 1 ? 1 : 0],
    );

    const updateStreakQuery = `
        UPDATE users 
        SET consecutive_days = CASE 
            WHEN last_task_date = CURRENT_DATE - INTERVAL 1 DAY THEN consecutive_days + 1
            WHEN last_task_date = CURRENT_DATE THEN consecutive_days
            ELSE 1 
        END,
        last_task_date = CURRENT_DATE
        WHERE user_id = ?
    `;
    await db.promise().execute(updateStreakQuery, [userId]);

    await db.promise().execute(
      `UPDATE users SET
                total_coins = total_coins + ?,
                total_xp = total_xp + ?
            WHERE user_id = ?`,
      [earnedCoins, earnedXP, userId],
    );

    res.status(200).json({
      success: true,
      message: petResult?.isLevelUp
        ? "Level UP! Your pet is grow up"
        : "Focus session ended",
      data: {
        task_id: finalTaskId,
        earned_coins: earnedCoins,
        earned_xp: earnedXP,
        lucky_draw: rewardItem, //send this object to create animation
        is_bonus: isCompletedFullTime,
        pets_stats: petResult
          ? {
              level: petResult.newLevel,
              total_exp: petResult.newExp,
              current_bar_exp: petResult.currentLevelExp,
              max_bar_exp: petResult.maxLevelExp,
              is_level_up: petResult.isLevelUp,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error at processFocusEnd:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
