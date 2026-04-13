const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createAdapterRedisClient } = require('../config/redis');

let io;

// Hỗ trợ nhiều origin cách nhau bằng dấu phẩy, VD: "http://localhost:5173,http://localhost:5600"
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Cho phép requests không có origin (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${origin}' không được phép`));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Redis Pub/Sub adapter cho phép scale nhiều instance
  const pubClient = createAdapterRedisClient();
  const subClient = createAdapterRedisClient();

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('[Socket.IO] Redis adapter đã được gắn.');
    })
    .catch((err) => {
      console.error('[Socket.IO] Lỗi kết nối Redis adapter:', err.message);
    });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client kết nối: ${socket.id}`);

    // Client tham gia vào room của conversation
    socket.on('join-conversation', (conversationId) => {
      const room = `conversation:${conversationId}`;
      socket.join(room);
      console.log(`[Socket.IO] ${socket.id} đã tham gia room ${room}`);
    });

    // Client rời khỏi room
    socket.on('leave-conversation', (conversationId) => {
      const room = `conversation:${conversationId}`;
      socket.leave(room);
      console.log(`[Socket.IO] ${socket.id} đã rời room ${room}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client ngắt kết nối: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Trả về instance io để dùng trong controllers.
 * Phải gọi initSocket trước.
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO chưa được khởi tạo. Gọi initSocket() trước.');
  }
  return io;
};

module.exports = { initSocket, getIO };
