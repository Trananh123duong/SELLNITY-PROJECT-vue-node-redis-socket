require('dotenv').config();

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const conversationRoutes = require('./routes/conversation.route');

const errorHandler = require('./middleware/errorHandler');
const { checkConnection } = require('./config/db');
const { redisClient } = require('./config/redis');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
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

redisClient.connect().catch((err) => {
  console.error('[Redis] Không thể kết nối khi khởi động:', err.message);
});

initSocket(server);

server.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});