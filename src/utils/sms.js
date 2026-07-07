import axios from 'axios';
import { logger } from './logger.js';

const generateSMSCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const sendSMS = async (phone, message) => {
  try {
    // Replace with your actual SMS API
    const response = await axios.post(
      process.env.SMS_API_URL,
      {
        phone,
        message
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SMS_API_KEY}`
        }
      }
    );

    logger.info(`SMS sent to ${phone}`);
    return true;
  } catch (error) {
    logger.error('SMS sending error:', error);
    return false;
  }
};

export { generateSMSCode };
