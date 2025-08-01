const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/data', require('./routes/data'));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
