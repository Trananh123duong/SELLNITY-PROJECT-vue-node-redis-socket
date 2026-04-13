import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket = null

/**
 * Khởi tạo kết nối Socket.IO.
 * Gọi sau khi user đăng nhập thành công.
 */
export const connectSocket = () => {
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  })

  socket.on('connect', () => {
    console.log('[Socket.IO] Đã kết nối:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Ngắt kết nối:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket.IO] Lỗi kết nối:', err.message)
  })

  return socket
}

/**
 * Ngắt kết nối Socket.IO.
 * Gọi khi user đăng xuất.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/**
 * Tham gia vào room của một conversation.
 * Nếu socket chưa connect, đăng ký join ngay khi connect xong.
 */
export const joinConversation = (conversationId) => {
  if (!socket) return

  const room = `conversation:${conversationId}`

  if (socket.connected) {
    socket.emit('join-conversation', conversationId)
  } else {
    // Đợi connect xong rồi join (trường hợp gọi ngay sau connectSocket)
    socket.once('connect', () => {
      socket.emit('join-conversation', conversationId)
    })
  }
}

/**
 * Rời khỏi room của một conversation.
 */
export const leaveConversation = (conversationId) => {
  if (socket?.connected) {
    socket.emit('leave-conversation', conversationId)
  }
}

/**
 * Lắng nghe event tin nhắn mới.
 * @param {Function} callback - Nhận vào message object
 * @returns {Function} Hàm để gỡ listener
 */
export const onNewMessage = (callback) => {
  if (!socket) return () => {}
  socket.on('new-message', callback)
  return () => socket.off('new-message', callback)
}

export const getSocket = () => socket
