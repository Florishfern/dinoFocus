const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {username, email, password} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const userSql = "INSERT INTO users (username, email, password) VALUES (?,?,?)";

        db.query(userSql, [username, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({error: err.message});

            const newUserId = result.insertId;

            const petSql = "INSERT INTO pets (user_id, dino_id, is_active) VALUES (?,?,?)";
            db.query(petSql, [newUserId, 1, true], (petErr) => {
                if(petErr) return res.status(500).json({error: petErr.message});

                res.status(201).json({
                    message: "สมัครสมาชิกสำเร็จ! ได้รับ Sonnet Puffy แล้ว",
                    userId: newUserId
                });
            });
    
        });
    } catch(error){
        res.status(500).json({error: "Server error"});
    }
}

exports.login = async (req,res) => {
    const {email, password, rememberMe} = req.body;

    try{
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, result) => {
            if(err) return res.status(500).json({error: err.message});
            if(result.length === 0) return res.status(404).json({message: "User Not found"});

            const user = result[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(401).json({message: "incorrect password"});

            const tokenAge = rememberMe ? '30d' : '24h';

            const token = jwt.sign(
                {id: user.user_id, username: user.username},
                process.env.JWT_SECRET || 'your_secret_key',
                {expiresIn: tokenAge}  
            );

            res.json({
                message: "เข้าสู่ระบบสำเร็จ",
                token,
                user: {id: user.user_id, username: user.username}
            });
        });
    } catch(err){
        res.status(500).json({error: err.message});
    }
}