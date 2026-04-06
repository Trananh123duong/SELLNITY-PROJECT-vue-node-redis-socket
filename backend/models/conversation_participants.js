const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conversation_participants', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id'
      },
      unique: "conversation_participants_conversation_id_user_id_key"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "conversation_participants_conversation_id_user_id_key"
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_read_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'conversation_participants',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "conversation_participants_conversation_id_user_id_key",
        unique: true,
        fields: [
          { name: "conversation_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "conversation_participants_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
