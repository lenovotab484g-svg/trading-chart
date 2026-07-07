import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, deviceId) => {
  return jwt.sign(
    {
      userId,
      deviceId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION || '3h'
    }
  );
};

export const generateRefreshToken = (userId, deviceId) => {
  return jwt.sign(
    {
      userId,
      deviceId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
