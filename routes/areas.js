const router = require('express').Router();
const { Area } = require('../db/mongo');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    res.json(await Area.find().sort('name').lean());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    res.json(await Area.create(req.body));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
