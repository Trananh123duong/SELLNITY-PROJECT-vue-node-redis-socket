const asyncHandler = require('express-async-handler');
const {
  conversations: Conversation,
  conversation_participants: ConversationParticipant,
  users: User,
  messages: Message
} = require('../models');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

/**
 * POST /api/conversations/private
 * Tạo hoặc lấy phòng chat 1-1
 */
const createPrivateConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({
      success: false,
      message: 'targetUserId là bắt buộc'
    });
  }

  if (Number(targetUserId) === Number(currentUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Không thể tạo cuộc trò chuyện với chính mình'
    });
  }

  const targetUser = await User.findByPk(targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'Người dùng không tồn tại'
    });
  }

  const result = await sequelize.transaction(async (transaction) => {
    /**
     * Tìm conversation private giữa 2 user
     */
    const existingConversation = await sequelize.query(
      `
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants cp1
        ON c.id = cp1.conversation_id
      JOIN conversation_participants cp2
        ON c.id = cp2.conversation_id
      WHERE c.type = 'private'
        AND cp1.user_id = :currentUserId
        AND cp2.user_id = :targetUserId
      LIMIT 1
      `,
      {
        replacements: {
          currentUserId,
          targetUserId
        },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    let conversationId;

    /**
     * Nếu đã có room
     */
    if (existingConversation.length > 0) {
      conversationId = existingConversation[0].id;
    } else {
      /**
       * Tạo room mới
       */
      const newConversation = await Conversation.create(
        {
          type: 'private',
          created_by: currentUserId
        },
        { transaction }
      );

      conversationId = newConversation.id;

      await ConversationParticipant.bulkCreate(
        [
          {
            conversation_id: conversationId,
            user_id: currentUserId
          },
          {
            conversation_id: conversationId,
            user_id: targetUserId
          }
        ],
        { transaction }
      );
    }

    const participants = await ConversationParticipant.findAll({
      where: {
        conversation_id: conversationId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'full_name', 'email']
        }
      ],
      transaction
    });

    return {
      conversationId,
      type: 'private',
      participants: participants.map((p) => ({
        id: p.user.id,
        username: p.user.username,
        full_name: p.user.full_name,
        email: p.user.email
      }))
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Tạo hoặc lấy conversation thành công',
    data: result
  });
});

/**
 * GET /api/conversations
 * Lấy danh sách conversation của user
 */
const getUserConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;

  const userConversations = await ConversationParticipant.findAll({
    where: {
      user_id: currentUserId
    },
    include: [
      {
        model: Conversation,
        as: 'conversation',
        include: [
          {
            model: ConversationParticipant,
            as: 'conversation_participants',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'full_name', 'email']
              }
            ]
          }
        ]
      }
    ]
  });

  const conversations = await Promise.all(
    userConversations.map(async (participant) => {
      const conv = participant.conversation;

      const otherParticipant = conv.conversation_participants.find(
        (p) => p.user_id !== currentUserId
      );

      const lastMessage = await Message.findOne({
        where: {
          conversation_id: conv.id
        },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'content', 'sender_id', 'created_at']
      });

      return {
        conversationId: conv.id,
        type: conv.type,
        otherUser: otherParticipant
          ? {
              id: otherParticipant.user.id,
              username: otherParticipant.user.username,
              full_name: otherParticipant.user.full_name,
              email: otherParticipant.user.email
            }
          : null,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              senderId: lastMessage.sender_id,
              createdAt: lastMessage.created_at
            }
          : null,
        updatedAt: conv.updated_at,
        unreadCount: 0
      };
    })
  );

  return res.status(200).json({
    success: true,
    message: 'Lấy danh sách conversation thành công',
    data: conversations
  });
});

/**
 * GET /api/conversations/:id
 * Lấy chi tiết conversation
 */
const getConversationById = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const conversationId = req.params.id;

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const offset = (page - 1) * limit;

  const userParticipant = await ConversationParticipant.findOne({
    where: {
      conversation_id: conversationId,
      user_id: currentUserId
    }
  });

  if (!userParticipant) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập conversation này'
    });
  }

  const conversation = await Conversation.findByPk(conversationId, {
    include: [
      {
        model: ConversationParticipant,
        as: 'conversation_participants',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'full_name', 'email']
          }
        ]
      }
    ]
  });

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation không tồn tại'
    });
  }

  const messages = await Message.findAll({
    where: {
      conversation_id: conversationId
    },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'full_name']
      }
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return res.status(200).json({
    success: true,
    message: 'Lấy chi tiết conversation thành công',
    data: {
      conversation: {
        id: conversation.id,
        type: conversation.type,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at
      },
      participants: conversation.conversation_participants.map((p) => ({
        id: p.user.id,
        username: p.user.username,
        full_name: p.user.full_name,
        email: p.user.email
      })),
      messages,
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    }
  });
});

/**
 * POST /api/conversations/:id/messages
 * Gửi tin nhắn vào conversation
 */
const sendMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const conversationId = req.params.id;
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nội dung tin nhắn là bắt buộc'
    });
  }

  const result = await sequelize.transaction(async (transaction) => {
    const userParticipant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversationId,
        user_id: currentUserId
      },
      transaction
    });

    if (!userParticipant) {
      return {
        statusCode: 403,
        body: {
          success: false,
          message: 'Bạn không có quyền gửi tin nhắn trong conversation này'
        }
      };
    }

    const conversation = await Conversation.findByPk(conversationId, {
      transaction
    });

    if (!conversation) {
      return {
        statusCode: 404,
        body: {
          success: false,
          message: 'Conversation không tồn tại'
        }
      };
    }

    const message = await Message.create(
      {
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: content.trim()
      },
      { transaction }
    );

    await Conversation.update(
      {
        updated_at: new Date()
      },
      {
        where: { id: conversationId },
        transaction
      }
    );

    const createdMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'full_name']
        }
      ],
      transaction
    });

    return {
      statusCode: 201,
      body: {
        success: true,
        message: 'Gửi tin nhắn thành công',
        data: {
          id: createdMessage.id,
          content: createdMessage.content,
          conversationId: createdMessage.conversation_id,
          sender: createdMessage.sender,
          createdAt: createdMessage.created_at,
          updatedAt: createdMessage.updated_at
        }
      }
    };
  });

  return res.status(result.statusCode).json(result.body);
});

module.exports = {
  createPrivateConversation,
  getUserConversations,
  getConversationById,
  sendMessage
};