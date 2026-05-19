const express = require('express');
const router = express.Router();

const PRLog = require('../models/PRLog');

router.get('/', async (req, res) => {
  try {
    const prs = await PRLog.find().sort({ createdAt: -1 });
    res.json(prs);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const prs = await PRLog.find();

    const totalPRs = prs.length;

    const totalImagesOptimized = prs.reduce(
      (acc, item) =>
        acc + (item.totalImagesOptimized || 0),
      0
    );

    const totalSavedBytes = prs.reduce(
      (acc, item) =>
        acc + (item.totalSavedBytes || 0),
      0
    );

    const totalOriginalSize = prs.reduce(
      (acc, item) =>
        acc + (item.totalOriginalSize || 0),
      0
    );

    const totalOptimizedSize = prs.reduce(
      (acc, item) =>
        acc + (item.totalOptimizedSize || 0),
      0
    );

    const lastRun =
      prs.length > 0
        ? prs[0].optimizationTimestamp
        : null;

    res.json({
      totalPRs,
      totalImagesOptimized,
      totalSavedBytes,
      totalOriginalSize,
      totalOptimizedSize,
      lastRun
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;