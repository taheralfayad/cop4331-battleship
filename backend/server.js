const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const usersRouter = require('./api/usersAPI');
const cors = require('cors'); 
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });

app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send("Yessir");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
