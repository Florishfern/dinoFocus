const db = require('../config/db');

exports.getMyDinosByRarity = async (req, res) => {
    try{
        const userId = req.user.id;
        const {rarity} = req.query;

        const [myDinos] = await db.promise().execute(
            `SELECT p.*, c.dino_name, c.image_url, c.rarity
            FROM pets p
            JOIN dino_catalog c ON p.dino_id = c.dino_id
            WHERE p.user_id = ? AND c.rarity = ?`,
            [userId, rarity]
        );

        res.status(200).json({success: true, data: myDinos});
    } catch (err){
        res.status(500).json({message: "Server Error", error: err.message});
    }
};

exports.selectActivePet = async (req, res) => {
    try {
        const userId = req.user.id;
        const {pets_id} = req.body;

        await db.promise().execute(
            `UPDATE pets SET is_active = 0 WHERE user_id = ?`,
            [userId]
        );

        await db.promise().execute(
            `UPDATE pets SET is_active = 1 WHERE pets_id = ? AND user_id = ?`,
            [pets_id, userId]
        );

        res.status(200).json({success: true, message: "เปลี่ยนตัวละครสำเร็จ!"});
    } catch(err){
        res.status(500).json({message: "Error", error: err.message});
    }
};

exports.gachaRoll = async (req, res) => {
    try{
        const userId = req.user.id;
        const COST = 1000;

        const [user] = await db.promise().execute(
            `SELECT total_coins FROM users WHERE user_id = ?`,
            [userId]
        );

        if(user[0].total_coins < COST) return res.status(400).json({message: "Coins ไม่พอ!"});

        const roll = Math.random() * 100;
        let rarity = 'Common';
        if(roll > 99) rarity = 'Legendary';
        else if(roll > 90) rarity = 'Epic';
        else if(roll > 70) rarity = 'Rare';

        const [catalog] = await db.promise().execute(
            `SELECT dino_id, dino_name, image_url, rarity 
            FROM dino_catalog 
            WHERE rarity = ? ORDER BY RAND() LIMIT 1`, 
            [rarity]
        );

        if(catalog.length === 0) return res.status(404).json({message: "ไม่มี Dino ในระดับนี้"});

        const obtainedDino = catalog[0];
        const newDinoId = obtainedDino.dino_id;

        await db.promise().execute(
            `UPDATE users SET total_coins = total_coins - ? WHERE user_id = ?`,
            [COST, userId]
        );

        const [existingPet] = await db.promise().execute(
            `SELECT pets_id, level FROM pets WHERE user_id = ? AND dino_id = ?`,
            [userId, newDinoId]
        );

        let actionStatus = "";
        let finalLevel = 1;

        if(existingPet.length > 0){
            finalLevel = existingPet[0].level + 1;
            await db.promise().execute(
                `UPDATE pets SET level = ? WHERE pets_id = ?`,
                [finalLevel, existingPet[0].pets_id]
            );
            actionStatus = "Level Up!";
        }else{
            await db.promise().execute(
                `INSERT INTO pets (user_id, dino_id, level, exp, is_active) VALUES (?, ?, 1, 0, 0)`,
                [userId, newDinoId]
            );
            actionStatus = "New Dino!";
        }

        const [updateUser] = await db.promise().execute(
            `SELECT total_coins FROM users WHERE user_id = ?`,
            [userId]
        );

        res.status(200).json({
            success: true, 
            message: `สุ่มได้ระดับ ${rarity}!`,
            new_balance: updateUser[0].total_coins,
            data: {
                name: obtainedDino.dino_name,
                rarity: obtainedDino.rarity,
                image: obtainedDino.image_url,
                level: finalLevel,
                status: actionStatus
            }
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

// ดึงข้อมูลสัตว์เลี้ยงตัวที่กำลังใช้งานอยู่ (is_active = 1)
exports.getActivePet = async (req, res) => {
    try {
        const userId = req.user.id; // ดึง ID จาก token ผ่าน authMiddleware

        // Query หาตัวที่มี is_active = 1 ของ user คนนี้
    const [rows] = await db.promise().execute(
        `SELECT 
            p.pets_id, 
            c.dino_name, 
            c.rarity,
            c.image_url, 
            p.level, 
            p.exp, 
            p.is_active 
        FROM pets p
        JOIN dino_catalog c ON p.dino_id = c.dino_id
        WHERE p.user_id = ? AND p.is_active = 1 
        LIMIT 1`,
        [userId]
    );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบสัตว์เลี้ยงที่กำลังใช้งานอยู่"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0] // ส่งข้อมูลตัวที่เจอออกไป
        });
    } catch (err) {
        console.error("Error at getActivePet:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};