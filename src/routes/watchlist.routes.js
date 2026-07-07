import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createWatchlist,
  getWatchlists,
  updateWatchlist,
  deleteWatchlist,
  addSymbolToWatchlist,
  removeSymbolFromWatchlist,
  reorderWatchlists,
  reorderSymbolsInWatchlist
} from '../controllers/watchlist.controller.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Watchlist management
router.post('/', createWatchlist);
router.get('/', getWatchlists);
router.put('/:id', updateWatchlist);
router.delete('/:id', deleteWatchlist);

// Symbol management in watchlist
router.post('/:id/symbols', addSymbolToWatchlist);
router.delete('/:id/symbols/:symbolId', removeSymbolFromWatchlist);

// Reorder endpoints
router.put('/reorder/lists', reorderWatchlists);
router.put('/:id/reorder/symbols', reorderSymbolsInWatchlist);

export default router;
