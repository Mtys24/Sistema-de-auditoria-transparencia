const router = require('express').Router();
const { Item } = require('../db/mongo');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category')
      .populate('subcategory')
      .populate('areas')
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth(['admin', 'auditor']), async (req, res) => {
  try {
    const item = await Item.create(req.body);
    const populated = await Item.findById(item._id)
      .populate('category').populate('subcategory').populate('areas');
    res.json(populated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth(['admin', 'auditor']), async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('category').populate('subcategory').populate('areas');
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
