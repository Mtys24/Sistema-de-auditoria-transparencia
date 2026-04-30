const express = require('express');
const router = express.Router();
const { Config } = require('../db/mongo');
const { auth } = require('../middleware/auth');

// Get config
router.get('/:key', auth(), async (req, res) => {
  try {
    const config = await Config.findOne({ key: req.params.key });
    res.json(config ? config.value : {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Save config (admin only)
router.post('/:key', auth(['admin']), async (req, res) => {
  try {
    const config = await Config.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value: req.body },
      { upsert: true, new: true }
    );
    res.json(config.value);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
