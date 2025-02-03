require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/otpdb');

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors()); 

const port = process.env.SERVER_PORT || 3000;

const userRoute = require('./routes/userRoute')

app.use('/api',userRoute)

app.listen(port, ()=>{
    console.log('Server listen on port '+port);
    
})

