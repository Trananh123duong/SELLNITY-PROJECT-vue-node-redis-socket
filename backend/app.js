require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const conversationRoutes = require('./routes/conversation.route');

const errorHandler = require('./middleware/errorHandler');
const { checkConnection } = require('./config/db');

const app = express()
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);

app.use(errorHandler);

checkConnection();

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})