const router = require('express').Router();
const nodemailer = require('nodemailer');
const { Config, Item, Subcategory, Category } = require('../db/mongo');
const { auth } = require('../middleware/auth');

async function getTransporter() {
  const smtpCfg = await Config.findOne({ key: 'smtp' });
  if (!smtpCfg?.value?.host || !smtpCfg?.value?.user) {
    throw new Error('SMTP no configurado. Ve a Configuración del Sistema.');
  }
  const smtp = smtpCfg.value;
  return {
    transporter: nodemailer.createTransport({
      host: smtp.host,
      port: Number(smtp.port) || 465,
      secure: Number(smtp.port) !== 587,
      auth: { user: smtp.user, pass: smtp.pass }
    }),
    smtp
  };
}

// POST /api/notify — send real emails per area
router.post('/', auth(['admin', 'auditor']), async (req, res) => {
  try {
    const { id, type } = req.body;
    if (!id || !type) return res.status(400).json({ error: 'Faltan parámetros id y type.' });

    let target;
    if (type === 'item')      target = await Item.findById(id).populate('areas');
    else if (type === 'sub')  target = await Subcategory.findById(id).populate('areas');
    else if (type === 'cat')  target = await Category.findById(id).populate('areas');
    if (!target) return res.status(404).json({ error: 'Registro no encontrado.' });

    const { transporter, smtp } = await getTransporter();

    const [deadlineCfg, ccCfg] = await Promise.all([
      Config.findOne({ key: 'global_deadline' }),
      Config.findOne({ key: 'global_cc' })
    ]);
    const deadline = deadlineCfg?.value?.value || 'No definido';
    const cc = ccCfg?.value?.value || '';

    const areaEmailMap = target.area_emails || {};
    const areaList = (target.areas || [])
      .map(a => ({ name: a.name, emails: (areaEmailMap[String(a._id)] || '').trim() }))
      .filter(a => a.emails);

    if (!areaList.length) {
      return res.status(400).json({ error: 'Sin correos de responsables asignados.' });
    }

    const sent = [];
    for (const area of areaList) {
      const mailOpts = {
        from: `"${smtp.from || 'Auditoría Transparencia'}" <${smtp.user}>`,
        to: area.emails,
        subject: `[${area.name}] Recordatorio Subsanación: ${target.name}`,
        text: [
          `Estimados responsables del área ${area.name},`,
          '',
          `Se les recuerda que la fecha límite para subsanar las observaciones correspondientes a:`,
          `"${target.name}"`,
          `es el día ${deadline}.`,
          '',
          'Favor tomar las acciones necesarias antes de dicha fecha.',
          '',
          'Saludos,',
          smtp.from || 'Sistema de Auditoría Transparencia'
        ].join('\n')
      };
      if (cc) mailOpts.cc = cc;

      await transporter.sendMail(mailOpts);
      sent.push(`[${area.name}] → ${area.emails}`);
    }

    res.json({ ok: true, sent });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/notify/test — verify SMTP connection
router.post('/test', auth(['admin']), async (req, res) => {
  try {
    const { transporter, smtp } = await getTransporter();
    await transporter.verify();
    res.json({ ok: true, message: `Conexión exitosa con ${smtp.host}:${smtp.port}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
