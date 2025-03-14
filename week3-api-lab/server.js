const express = require('express');
const jwt   = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 6000;
const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey';

const users = [];

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({message: 'User registered successfully'});
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({message: 'User not found'});
    }

        const token = jwt.sign({ username:user.username }, SECRET_KEY, {expiresIn: '1h'});
        res.json({token});
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({message: `Welcome ${req.user.username}! Welcome to the protected route`});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


