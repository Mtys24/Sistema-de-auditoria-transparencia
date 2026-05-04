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

function formatDeadline(raw) {
  if (!raw || raw === 'No definido') return 'No definido';
  const [y, m, d] = raw.split('-');
  if (!y || !m || !d) return raw;
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}

function buildHtml({ areaName, itemName, deadline, senderName }) {
  const deadlineFormatted = formatDeadline(deadline);
  const now = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f8;font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f8;padding:40px 20px;">
  <tr><td align="center">

    <!-- CARD -->
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER BAND -->
      <tr>
        <td style="background:linear-gradient(135deg,#1e2340 0%,#2d3561 100%);padding:36px 40px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0 0 6px 0;font-size:11px;color:#8b9cc8;text-transform:uppercase;letter-spacing:0.12em;">Sistema de Auditoría</p>
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.2;">Recordatorio de Subsanación</h1>
              </td>
              <td align="right" valign="top">
                <span style="display:inline-block;background:#5b7fff;color:#ffffff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:6px 14px;border-radius:20px;">${areaName}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ACCENT LINE -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#5b7fff,#00c896);"></td></tr>

      <!-- BODY -->
      <tr>
        <td style="padding:36px 40px 20px;">

          <p style="margin:0 0 24px 0;font-size:15px;color:#4a5568;line-height:1.6;">
            Estimados responsables del área <strong style="color:#2d3561;">${areaName}</strong>,
          </p>

          <p style="margin:0 0 20px 0;font-size:14px;color:#4a5568;line-height:1.7;">
            Se les informa que existe una observación pendiente de subsanación en el sistema de auditoría de transparencia activa que requiere su atención:
          </p>

          <!-- ITEM BOX -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:#f7f8fc;border:1px solid #e2e6f0;border-left:4px solid #5b7fff;border-radius:8px;padding:18px 22px;">
                <p style="margin:0 0 4px 0;font-size:10px;color:#8b9cc8;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Ítem / Obligación</p>
                <p style="margin:0;font-size:15px;color:#1e2340;font-weight:600;line-height:1.4;">${itemName}</p>
              </td>
            </tr>
          </table>

          <!-- DEADLINE BOX -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="background:#fff8ec;border:1px solid #f5c842;border-radius:8px;padding:16px 22px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:36px;vertical-align:middle;">
                      <span style="font-size:22px;">⏰</span>
                    </td>
                    <td style="vertical-align:middle;padding-left:12px;">
                      <p style="margin:0 0 2px 0;font-size:10px;color:#b07d00;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Fecha Límite de Subsanación</p>
                      <p style="margin:0;font-size:16px;color:#7a5800;font-weight:700;">${deadlineFormatted}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 8px 0;font-size:14px;color:#4a5568;line-height:1.7;">
            Solicitamos tomar las acciones necesarias <strong>antes de la fecha indicada</strong> para dar cumplimiento a las obligaciones de transparencia activa establecidas por la normativa vigente.
          </p>

          <p style="margin:0 0 32px 0;font-size:14px;color:#4a5568;line-height:1.7;">
            Ante cualquier consulta, no dude en ponerse en contacto con el equipo de auditoría.
          </p>

          <!-- DIVIDER -->
          <hr style="border:none;border-top:1px solid #e8ecf4;margin:0 0 24px 0;">

          <p style="margin:0;font-size:14px;color:#2d3561;font-weight:600;">Saludos cordiales,</p>
          <p style="margin:4px 0 0 0;font-size:13px;color:#8b9cc8;">${senderName}</p>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f7f8fc;border-top:1px solid #e8ecf4;padding:20px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:11px;color:#a0aec0;line-height:1.6;">
                  Este correo fue generado automáticamente por el Sistema de Auditoría de Transparencia.<br>
                  Fecha de envío: ${now}
                </p>
              </td>
              <td align="right" valign="middle">
                <span style="font-size:10px;color:#c8d0e8;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">AUDITORIA · TRANSPARENCIA</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
    <!-- END CARD -->

  </td></tr>
</table>

</body>
</html>`;
}

function buildPlainText({ areaName, itemName, deadline, senderName }) {
  const deadlineFormatted = formatDeadline(deadline);
  return [
    `Estimados responsables del área ${areaName},`,
    '',
    `Se les informa que existe una observación pendiente de subsanación:`,
    `  "${itemName}"`,
    '',
    `Fecha límite de subsanación: ${deadlineFormatted}`,
    '',
    'Favor tomar las acciones necesarias antes de dicha fecha.',
    '',
    `Saludos,`,
    senderName
  ].join('\n');
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
    const senderName = smtp.from || 'Sistema de Auditoría Transparencia';

    const areaEmailMap = target.area_emails || {};
    const areaList = (target.areas || [])
      .map(a => ({ name: a.name, emails: (areaEmailMap[String(a._id)] || '').trim() }))
      .filter(a => a.emails);

    if (!areaList.length) {
      return res.status(400).json({ error: 'Sin correos de responsables asignados.' });
    }

    const sent = [];
    for (const area of areaList) {
      const tplData = { areaName: area.name, itemName: target.name, deadline, senderName };
      const mailOpts = {
        from: `"${senderName}" <${smtp.user}>`,
        to: area.emails,
        subject: `[${area.name}] Recordatorio de Subsanación — ${target.name}`,
        text: buildPlainText(tplData),
        html: buildHtml(tplData)
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
