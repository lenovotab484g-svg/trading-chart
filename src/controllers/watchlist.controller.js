import Watchlist from '../models/Watchlist.js';
import Symbol from '../models/Symbol.js';
import { logger } from '../utils/logger.js';

export const createWatchlist = async (req, res) => {
  try {
    const { name } = req.validatedData;
    const userId = req.userId;

    // Check if watchlist with same name already exists
    const existingWatchlist = await Watchlist.findOne({ userId, name });
    if (existingWatchlist) {
      return res.status(409).json({ message: 'Watchlist with this name already exists' });
    }

    // Get the highest order value
    const lastWatchlist = await Watchlist.findOne({ userId }).sort({ order: -1 });
    const newOrder = lastWatchlist ? lastWatchlist.order + 1 : 0;

    const watchlist = new Watchlist({
      userId,
      name,
      order: newOrder
    });

    await watchlist.save();
    await watchlist.populate('symbols');

    logger.info(`Watchlist created: ${watchlist._id}`);

    return res.status(201).json({
      message: 'Watchlist created successfully',
      watchlist
    });
  } catch (error) {
    logger.error('Create watchlist error:', error);
    return res.status(500).json({ message: 'Failed to create watchlist' });
  }
};

export const getWatchlists = async (req, res) => {
  try {
    const userId = req.userId;

    const watchlists = await Watchlist.find({ userId })
      .sort({ order: 1 })
      .populate('symbols');

    return res.status(200).json({
      watchlists,
      total: watchlists.length
    });
  } catch (error) {
    logger.error('Get watchlists error:', error);
    return res.status(500).json({ message: 'Failed to fetch watchlists' });
  }
};

export const updateWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.validatedData;
    const userId = req.userId;

    const watchlist = await Watchlist.findOne({ _id: id, userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    // Check if new name already exists
    if (name && name !== watchlist.name) {
      const existingWatchlist = await Watchlist.findOne({ userId, name });
      if (existingWatchlist) {
        return res.status(409).json({ message: 'Watchlist with this name already exists' });
      }
      watchlist.name = name;
    }

    await watchlist.save();
    await watchlist.populate('symbols');

    logger.info(`Watchlist updated: ${id}`);

    return res.status(200).json({
      message: 'Watchlist updated successfully',
      watchlist
    });
  } catch (error) {
    logger.error('Update watchlist error:', error);
    return res.status(500).json({ message: 'Failed to update watchlist' });
  }
};

export const deleteWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const watchlist = await Watchlist.findOneAndDelete({ _id: id, userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    logger.info(`Watchlist deleted: ${id}`);

    return res.status(200).json({ message: 'Watchlist deleted successfully' });
  } catch (error) {
    logger.error('Delete watchlist error:', error);
    return res.status(500).json({ message: 'Failed to delete watchlist' });
  }
};

export const addSymbolToWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { symbolId } = req.body;
    const userId = req.userId;

    const watchlist = await Watchlist.findOne({ _id: id, userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    // Check if symbol exists
    const symbol = await Symbol.findById(symbolId);
    if (!symbol) {
      return res.status(404).json({ message: 'Symbol not found' });
    }

    // Check if symbol already in watchlist
    if (watchlist.symbols.includes(symbolId)) {
      return res.status(409).json({ message: 'Symbol already in watchlist' });
    }

    watchlist.symbols.push(symbolId);
    await watchlist.save();
    await watchlist.populate('symbols');

    logger.info(`Symbol added to watchlist: ${id}`);

    return res.status(200).json({
      message: 'Symbol added to watchlist',
      watchlist
    });
  } catch (error) {
    logger.error('Add symbol to watchlist error:', error);
    return res.status(500).json({ message: 'Failed to add symbol' });
  }
};

export const removeSymbolFromWatchlist = async (req, res) => {
  try {
    const { id, symbolId } = req.params;
    const userId = req.userId;

    const watchlist = await Watchlist.findOne({ _id: id, userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.symbols = watchlist.symbols.filter(s => s.toString() !== symbolId);
    await watchlist.save();
    await watchlist.populate('symbols');

    logger.info(`Symbol removed from watchlist: ${id}`);

    return res.status(200).json({
      message: 'Symbol removed from watchlist',
      watchlist
    });
  } catch (error) {
    logger.error('Remove symbol from watchlist error:', error);
    return res.status(500).json({ message: 'Failed to remove symbol' });
  }
};

export const reorderWatchlists = async (req, res) => {
  try {
    const { watchlistIds } = req.body;
    const userId = req.userId;

    if (!Array.isArray(watchlistIds)) {
      return res.status(400).json({ message: 'watchlistIds must be an array' });
    }

    for (let i = 0; i < watchlistIds.length; i++) {
      await Watchlist.updateOne(
        { _id: watchlistIds[i], userId },
        { order: i }
      );
    }

    logger.info(`Watchlists reordered for user: ${userId}`);

    return res.status(200).json({ message: 'Watchlists reordered successfully' });
  } catch (error) {
    logger.error('Reorder watchlists error:', error);
    return res.status(500).json({ message: 'Failed to reorder watchlists' });
  }
};

export const reorderSymbolsInWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { symbolIds } = req.body;
    const userId = req.userId;

    const watchlist = await Watchlist.findOne({ _id: id, userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.symbols = symbolIds;
    await watchlist.save();
    await watchlist.populate('symbols');

    logger.info(`Symbols reordered in watchlist: ${id}`);

    return res.status(200).json({
      message: 'Symbols reordered successfully',
      watchlist
    });
  } catch (error) {
    logger.error('Reorder symbols error:', error);
    return res.status(500).json({ message: 'Failed to reorder symbols' });
  }
};
