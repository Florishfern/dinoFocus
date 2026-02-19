

const db = require('../config/db');

exports.createTask = async (req, res) => {
    try {
        const {title, category_id, task_type, focus_time_spent, method_333, date, position} = req.body;
        const userId = req.user.id;

        const taskDate = date ? `${date} 00:00:00` : new Date().toISOString().slice(0, 19).replace('T', ' ');

        if(task_type === 'METHOD_333' && !method_333){
            return res.status(400).json({message: "Please select 3-3-3 subtype(IMPORTANT, SHORTER, or MAINTENANCE"});
        }

        const [result] = await db.promise().execute(
            `INSERT INTO tasks (user_id, category_id, title, task_type, focus_time_spent, method_333, created_at, position)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, category_id || null, title, task_type, focus_time_spent, method_333 || null, taskDate, position || 0]
        );
        res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });
    } catch(err){
        console.error("SQL ERROR DETAIL:", err.message); 
        res.status(500).json({
            message: "Error creating task", 
            error: err.message // ส่ง error กลับไปดูที่ Browser ด้วย
        });
    }
};

exports.getTasks = async (req, res) => {
    try{
        const userId = req.user.id;

        let targetDate = req.query.date;

        if(!targetDate){
            targetDate = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Bangkok'})
        }

        // ใน taskController.js
        const query = `
            SELECT t.*, c.name AS category_name, c.color_code AS category_color
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.category_id
            WHERE t.user_id = ? AND DATE(t.created_at) = ?
            ORDER BY 
                t.task_type = 'METHOD_333' DESC, -- ให้กลุ่ม 3-3-3 ขึ้นก่อน (ถ้ามี)
                t.position ASC,                 -- เรียงตามลำดับที่ลากวางไว้
                t.created_at ASC                -- ถ้า position เท่ากัน ให้เรียงตามเวลาที่สร้าง
        `;

        const [rows] = await db.promise().execute(query, [userId, targetDate]);

        res.status(200).json({
            displayDate: targetDate,
            total: rows.length,
            tasks: rows
        });

    } catch(err){
        res.status(500).json({message: "Error fetching tasks", error: err.message});
    }
}

exports.updateTaskStatus =  async (req, res) => {
    try{
        const {id} = req.params;
        const {is_completed} = req.body;
        const userId = req.user.id;
    
        const [result] = await db.promise().execute(
            `UPDATE tasks 
             SET is_completed = ? 
             WHERE task_id = ? AND user_id = ?`,
            [is_completed ? 1 : 0, id, userId]
        );
    
        if(result.affectedRows === 0){
            return res.status(404).json({message: "Task not found or no permission"});
        }

        res.status(200).json({message: "Task status updated successfully"});
    }catch(err){
        res.status(500).json({message: "Error updating task status", error: err.message});
    }
};

exports.deleteTask = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;
        const [result] = await db.promise().execute(
            'DELETE FROM tasks WHERE task_id = ? AND user_id = ?',
            [id, userId]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message: "Task not found"});
        }

        res.status(200).json({message: "Task deleted succesfully"});
    } catch (err){
        res.status(500).json({message: "Error deleting task", error: err.message});
    }
};

// ใน taskController.js
exports.getTaskSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetDate = req.query.date || new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Bangkok'});

        const taskQuery = `
            SELECT  
                COUNT(*) as total_tasks,
                SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_tasks,
                IFNULL(SUM(focus_time_spent), 0) as total_planned_time,
                IFNULL(SUM(CASE WHEN is_completed = 0 THEN focus_time_spent ELSE 0 END), 0) as remaining_planned_time
            FROM tasks
            WHERE user_id = ? AND DATE(created_at) = ?
        `;

        const logQuery = `
            SELECT IFNULL(SUM(duration_minutes), 0) as total_actual_spent
            FROM focus_logs
            WHERE user_id = ? AND DATE(start_time) = ?
        `;
        
        const [[taskStats]] = await db.promise().execute(taskQuery, [userId, targetDate]);
        const [[logStats]] = await db.promise().execute(logQuery, [userId, targetDate]);

        const totalPlanned = parseInt(taskStats.total_planned_time);
        const remainingPlanned = parseInt(taskStats.remaining_planned_time);
        const totalActualSpent = parseInt(logStats.total_actual_spent);

        res.status(200).json({
            summary: {
                tasks: {
                    total: taskStats.total_tasks || 0,
                    completed: taskStats.completed_tasks || 0
                },
                time: {
                    total_planned: totalPlanned,
                    total_actual_spent: totalActualSpent, // เวลาสะสมที่กด Start/Finish จากหน้า Timer
                    time_remaining: remainingPlanned      //
                }
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching summary", error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. เพิ่ม method_333 และ position เข้ามารับค่าจาก Frontend
        const { title, focus_time_spent, category_id, task_type, method_333, position } = req.body;
        const userId = req.user.id;

        // ดึงข้อมูลเดิมมาเผื่อไว้ (Fallback)
        const [rows] = await db.promise().execute(
            `SELECT * FROM tasks WHERE task_id = ? AND user_id = ?`,
            [id, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Task not found or no permission" });
        }

        const currentTask = rows[0];

        // 2. เพิ่มคอลัมน์ method_333 และ position ใน SQL Update
        const query = `
            UPDATE tasks
            SET title = ?, 
                focus_time_spent = ?, 
                category_id = ?, 
                task_type = ?, 
                method_333 = ?, 
                position = ?
            WHERE task_id = ? AND user_id = ?
        `;

        await db.promise().execute(query, [
            title !== undefined ? title : currentTask.title,
            focus_time_spent !== undefined ? focus_time_spent : currentTask.focus_time_spent,
            category_id !== undefined ? category_id : currentTask.category_id,
            task_type !== undefined ? task_type : currentTask.task_type,
            method_333 !== undefined ? method_333 : currentTask.method_333, // บันทึกกลุ่ม (IMPORTANT/SECONDARY/MINOR)
            position !== undefined ? position : currentTask.position,     // บันทึกลำดับ
            id,
            userId
        ]);

        res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
        console.error("Update error:", err.message);
        res.status(500).json({ message: "Error updating task", error: err.message });
    }
}

exports.reorderTasks = async (req,res) => {
    try {
        const {tasks} = req.body;
        const userId = req.user.id;

        const updatePromises = tasks.map(task => {
            return db.promise().execute(
                'UPDATE tasks SET position = ? WHERE task_id = ? AND user_id = ?',
                [task.position, task.task_id, userId]
            );
        });
        await Promise.all(updatePromises);
        res.status(200).json({message: "Reordered successfully"});
    } catch(err){
        res.status(500).json({message: "Error reordering", error: err.message});
    }
}

