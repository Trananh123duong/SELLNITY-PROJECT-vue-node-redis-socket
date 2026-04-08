const asyncHandler = require('express-async-handler');
const { users: User } = require('../models');
const { Op } = require('sequelize');
const {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix
} = require('../utils/cache');

// GET ALL
const getUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const normalizedSearch = search?.trim().toLowerCase() || '';
  const listCacheKey = `users:list:${normalizedSearch}`;
  const cachedUsers = getCache(listCacheKey);

  if (cachedUsers) {
    return res.status(200).json(cachedUsers);
  }

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

  const response = {
    success: true,
    data: users
  };

  setCache(listCacheKey, response, 120);

  return res.status(200).json(response);
});

// GET BY ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const detailCacheKey = `users:detail:${id}`;
  const cachedUser = getCache(detailCacheKey);

  if (cachedUser) {
    return res.status(200).json(cachedUser);
  }

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const response = {
    success: true,
    data: user
  };

  setCache(detailCacheKey, response, 300);

  return res.status(200).json(response);
});

// CREATE
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  deleteCacheByPrefix('users:list:');

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

  deleteCacheByPrefix('users:list:');
  deleteCache(`users:detail:${id}`);

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

  deleteCacheByPrefix('users:list:');
  deleteCache(`users:detail:${id}`);

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