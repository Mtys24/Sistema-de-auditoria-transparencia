const router = require('express').Router();
const { Category, Subcategory } = require('../db/mongo');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    res.json(await Category.find().sort('order name').lean());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    res.json(await Category.create(req.body));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Subcategorías
router.get('/:id/subcategories', async (req, res) => {
  try {
    res.json(await Subcategory.find({ category: req.params.id }).sort('order name').lean());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/subcategories/all', async (req, res) => {
  try {
    res.json(await Subcategory.find().populate('category areas').sort('order name').lean());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/subcategories', auth(['admin']), async (req, res) => {
  try {
    res.json(await Subcategory.create({ ...req.body, category: req.params.id }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/subcategories/:id', auth(['admin', 'auditor']), async (req, res) => {
  try {
    res.json(await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/subcategories/:id', auth(['admin']), async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const id = req.params.id;
    await Subcategory.deleteMany({ category: id });
    await Category.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
