require('dotenv').config()

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');
const focusRoutes = require('./routes/focusRoutes');
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');

const app = express();


//Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json());

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', friendRoutes);

app.get('/api/dinos', (req, res) => {
  // สมมติว่าดึงข้อมูลจาก DB มาแล้ว
  const dinos = [
    { dino_id: 1, dino_name: "T-Rex", rarity: "Legendary", image_url: "trex.png" },
    // ...
  ];
  res.json(dinos);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
