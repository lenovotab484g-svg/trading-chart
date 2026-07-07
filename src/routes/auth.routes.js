import express from 'express';
import {
  requestSMSCode,
  verifySMSCode,
  refreshAccessToken,
  getUser
} from '../controllers/auth.controller.js';
import { validateRequest, phoneSchema, verifyCodeSchema } from '../utils/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Request SMS code
router.post('/request-code', validateRequest(phoneSchema), requestSMSCode);

// Verify SMS code and register/login
router.post('/verify-code', validateRequest(verifyCodeSchema), verifySMSCode);

// Refresh access token
router.post('/refresh-token', refreshAccessToken);

// Get user information (requires authentication)
router.get('/user', verifyToken, getUser);

export default router;
