const db = require('../config/db');


exports.createCategory = async (req, res) => {
    try{
        const {name, color_code} = req.body;
        const userId = req.user.id;

        const [existing] = await db.promise().execute(
            'SELECT category_id FROM categories WHERE user_id = ? AND LOWER(name) = LOWER(?)',
            [userId, name]
        );

        if (existing.length > 0) {
            return res.status(200).json({ 
                message: "Category already exists", 
                categoryId: existing[0].category_id 
            });
        }

        const allowColors = ['#ff7900', '#38b000', '#3f8efc', '#c77dff', '#ffd60a', '#87bfff', '#fb4b4e'];
        const finalColor = allowColors.includes(color_code)? color_code : '#3f8efc';

        const [result] = await db.promise().execute(
            'INSERT INTO categories (user_id, name, color_code) VALUES (?,?,?)', [userId, name, finalColor]
        );

        console.log("New Category ID:", result.insertId);

        res.status(201).json({message: "Category created successfully", categoryId: result.insertId});
    } catch(err){
        res.status(500).json({message: "Error creating category", error: err.message});
    }
}

exports.getCategory = async (req, res) => { // กลับมาใช้ async
    try {
        const userId = req.user.id;

        const [rows] = await db.promise().execute(
            'SELECT * FROM categories WHERE user_id = ?',
            [userId]
        );

        res.status(200).json(rows);

    } catch(err){
        res.status(500).json({message: "Error fetching categories", error: err.message});
    }
};

exports.updateCategory = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, color_code} = req.body;
        const userId = req.user.id;

        const allowColors = ['#ff7900', '#38b000', '#3f8efc', '#c77dff', '#ffd60a', '#87bfff', '#fb4b4e'];
        const finalColor = allowColors.includes(color_code) ? color_code : '#3f8efc';

        const [result] = await db.promise().execute(
            'UPDATE categories SET name = ?, color_code = ? WHERE category_id = ? AND user_id = ?',
            [name, color_code, id, userId]
        );

        if(result.affectRows === 0){
            return res.status(404).json({message: "Category not found or no permission"});
        }
        res.status(200).json({message: "Category updated successfully"});
    } catch(err){
        res.status(500).json({message: "Error updating category", error: err.message});
    }
};

exports.deleteCategory = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;

        const [result] = await db.promise().execute(
            'DELETE FROM categories WHERE category_id = ? AND user_id = ?',
            [id, userId]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message: "Category not found or no permission"});
        }

        res.status(200).json({message: "Category deleted successfully"});
    } catch (err){
        res.status(500).json({message: "Error deleting category", error: err.message});
    }
}