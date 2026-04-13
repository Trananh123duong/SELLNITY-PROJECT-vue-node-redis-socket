const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { users: User } = require('../models');
const {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix
} = require('../utils/cache');

const register = asyncHandler(async (req, res) => {
  const { username, email, full_name, password, phone } = req.body;

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return res.status(400).json({
      message: 'Email đã được sử dụng'
    });
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    return res.status(400).json({
      message: 'Username đã được sử dụng'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    full_name,
    password: hashedPassword,
    phone
  });

  await deleteCacheByPrefix('users:list:');

  return res.status(201).json({
    message: 'Đăng ký thành công',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
      phone: newUser.phone
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({
      message: 'Email hoặc mật khẩu không đúng'
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: 'Email hoặc mật khẩu không đúng'
    });
  }

  const payload = {
    id: user.id,
    email: user.email
  };

  const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '1h'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '30d'
  });

  await user.update({
    refresh_token: refreshToken
  });

  return res.status(200).json({
    message: 'Đăng nhập thành công',
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone
    }
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const cacheKey = `auth:profile:${req.user.id}`;
  const cachedProfile = await getCache(cacheKey);

  if (cachedProfile) {
    return res.status(200).json(cachedProfile);
  }

  const user = await User.findByPk(req.user.id, {
    attributes: {
      exclude: ['password', 'refresh_token']
    }
  });

  if (!user) {
    return res.status(404).json({
      message: 'Không tìm thấy user'
    });
  }

  await setCache(cacheKey, user, 60);

  return res.status(200).json(user);
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: 'Thiếu refresh token'
    });
  }

  const user = await User.findOne({
    where: { refresh_token: token }
  });

  if (!user) {
    return res.status(403).json({
      message: 'Refresh token không hợp lệ'
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_KEY);

  const newAccessToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email
    },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    accessToken: newAccessToken
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: 'Không tìm thấy user'
    });
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(401).json({
      message: 'Mật khẩu hiện tại không đúng'
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
    refresh_token: null
  });

  await deleteCache(`auth:profile:${req.user.id}`);

  return res.status(200).json({
    message: 'Đổi mật khẩu thành công, vui lòng đăng nhập lại'
  });
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: 'Không tìm thấy user'
    });
  }

  await user.update({
    refresh_token: null
  });

  await deleteCache(`auth:profile:${req.user.id}`);

  return res.status(200).json({
    message: 'Đăng xuất thành công'
  });
});

module.exports = {
  register,
  login,
  getMyProfile,
  refreshAccessToken,
  changePassword,
  logout
};