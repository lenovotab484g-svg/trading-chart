import Symbol from '../models/Symbol.js';
import { logger } from '../utils/logger.js';

export const getSymbols = async (req, res) => {
  try {
    const { type, market, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (market) query.market = market;
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const symbols = await Symbol.find(query).sort({ code: 1 });

    return res.status(200).json({
      symbols,
      total: symbols.length
    });
  } catch (error) {
    logger.error('Get symbols error:', error);
    return res.status(500).json({ message: 'Failed to fetch symbols' });
  }
};

export const searchSymbols = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const query = {
      $or: [
        { code: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    };

    if (type) query.type = type;

    const symbols = await Symbol.find(query).limit(20).sort({ code: 1 });

    return res.status(200).json({
      symbols,
      total: symbols.length
    });
  } catch (error) {
    logger.error('Search symbols error:', error);
    return res.status(500).json({ message: 'Failed to search symbols' });
  }
};

export const createSymbol = async (req, res) => {
  try {
    const { code, name, type, market } = req.validatedData;

    // Check if symbol already exists
    const existingSymbol = await Symbol.findOne({ code });
    if (existingSymbol) {
      return res.status(409).json({ message: 'Symbol already exists' });
    }

    const symbol = new Symbol({
      code,
      name,
      type,
      market
    });

    await symbol.save();

    logger.info(`Symbol created: ${code}`);

    return res.status(201).json({
      message: 'Symbol created successfully',
      symbol
    });
  } catch (error) {
    logger.error('Create symbol error:', error);
    return res.status(500).json({ message: 'Failed to create symbol' });
  }
};

export const updateSymbolPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPrice, priceChange, priceChangePercent } = req.body;

    const symbol = await Symbol.findByIdAndUpdate(
      id,
      {
        currentPrice,
        priceChange,
        priceChangePercent,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!symbol) {
      return res.status(404).json({ message: 'Symbol not found' });
    }

    logger.info(`Symbol price updated: ${id}`);

    return res.status(200).json({
      message: 'Symbol price updated successfully',
      symbol
    });
  } catch (error) {
    logger.error('Update symbol price error:', error);
    return res.status(500).json({ message: 'Failed to update symbol price' });
  }
};
