import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.deviceId = decoded.deviceId;

    // Verify device is still active
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if device is in active sessions
    const isDeviceActive = user.activeSessions.some(
      session => session.deviceId === decoded.deviceId
    );

    if (!isDeviceActive) {
      return res.status(401).json({ 
        message: 'This device has been logged out. Please login again.' 
      });
    }

    // Update last activity time
    const sessionIndex = user.activeSessions.findIndex(
      session => session.deviceId === decoded.deviceId
    );
    
    if (sessionIndex !== -1) {
      user.activeSessions[sessionIndex].lastActivityTime = new Date();
      await user.save();
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired');
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    logger.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
