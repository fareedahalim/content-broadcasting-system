const express = require('express');

require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

app.use(express.json());

const port = process.env.PORT;


app.use('/auth', authRoutes);

app.use('/content', contentRoutes);

app.get('/', (req, res) => {
    res.send('API Running')
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});