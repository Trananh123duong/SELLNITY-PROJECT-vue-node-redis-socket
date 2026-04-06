const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversation.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/private', verifyToken, conversationController.createPrivateConversation);
router.post('/:id/messages', verifyToken, conversationController.sendMessage);
router.get('/', verifyToken, conversationController.getUserConversations);
router.get('/:id', verifyToken, conversationController.getConversationById);

module.exports = router;