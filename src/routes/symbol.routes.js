import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getSymbols,
  searchSymbols,
  createSymbol,
  updateSymbolPrice
} from '../controllers/symbol.controller.js';

const router = express.Router();

// Symbol search (public)
router.get('/search', searchSymbols);

// All other routes require authentication
router.use(verifyToken);

router.get('/', getSymbols);
router.post('/', createSymbol);
router.put('/:id/price', updateSymbolPrice);

export default router;
