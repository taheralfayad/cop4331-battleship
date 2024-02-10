const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });

app.get('/', (req, res) => {
  res.send("Yessir");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
