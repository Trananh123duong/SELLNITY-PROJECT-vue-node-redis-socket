const asyncHandler = require('express-async-handler');
const { users: User } = require('../models');
const { Op } = require('sequelize');

// GET ALL
const getUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const where = {};

  if (search?.trim()) {
    where[Op.or] = [
      {
        username: {
          [Op.iLike]: `%${search.trim()}%`
        }
      },
      {
        full_name: {
          [Op.iLike]: `%${search.trim()}%`
        }
      }
    ];
  }

  const users = await User.findAll({
    where,
    attributes: {
      exclude: ['password', 'refresh_token']
    },
    order: [['full_name', 'ASC']]
  });

  res.status(200).json({
    success: true,
    data: users
  });
});

// GET BY ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// CREATE
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

// UPDATE
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.update(req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// DELETE
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.destroy();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};