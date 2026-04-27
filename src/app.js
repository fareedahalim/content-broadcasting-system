const express = require('express');
require('dotenv').config();

const db = require('./config/db'); // add this

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;


db.query('SELECT NOW()')
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB ERROR:", err));

app.use('/auth', authRoutes);
app.use('/content', contentRoutes);

app.get('/', (req,res)=>{
   res.send('API Running');
});

app.listen(port,()=>{
   console.log(`Server running on port ${port}`);
});