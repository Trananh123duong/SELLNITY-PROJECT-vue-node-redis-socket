var DataTypes = require("sequelize").DataTypes;
var _conversation_participants = require("./conversation_participants");
var _conversations = require("./conversations");
var _message_status = require("./message_status");
var _messages = require("./messages");
var _users = require("./users");

function initModels(sequelize) {
  var conversation_participants = _conversation_participants(sequelize, DataTypes);
  var conversations = _conversations(sequelize, DataTypes);
  var message_status = _message_status(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  conversation_participants.belongsTo(conversations, { as: "conversation", foreignKey: "conversation_id"});
  conversations.hasMany(conversation_participants, { as: "conversation_participants", foreignKey: "conversation_id"});
  messages.belongsTo(conversations, { as: "conversation", foreignKey: "conversation_id"});
  conversations.hasMany(messages, { as: "messages", foreignKey: "conversation_id"});
  message_status.belongsTo(messages, { as: "message", foreignKey: "message_id"});
  messages.hasMany(message_status, { as: "message_statuses", foreignKey: "message_id"});
  messages.belongsTo(messages, { as: "reply_to_message", foreignKey: "reply_to_message_id"});
  messages.hasMany(messages, { as: "messages", foreignKey: "reply_to_message_id"});
  conversation_participants.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(conversation_participants, { as: "conversation_participants", foreignKey: "user_id"});
  conversations.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(conversations, { as: "conversations", foreignKey: "created_by"});
  message_status.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(message_status, { as: "message_statuses", foreignKey: "user_id"});
  messages.belongsTo(users, { as: "sender", foreignKey: "sender_id"});
  users.hasMany(messages, { as: "messages", foreignKey: "sender_id"});

  return {
    conversation_participants,
    conversations,
    message_status,
    messages,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
