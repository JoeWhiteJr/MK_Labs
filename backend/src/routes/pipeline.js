const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// All routes require authentication
router.use(authenticate);

const VALID_STATUSES = ['discovery', 'proposal', 'negotiation', 'won', 'lost'];

// GET /api/pipeline — list all leads
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM leads WHERE created_by = $1 ORDER BY updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch leads' } });
  }
});

// GET /api/pipeline/metrics — pipeline summary
router.get('/metrics', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
        COUNT(*) FILTER (WHERE status NOT IN ('won', 'lost')) AS active_leads,
        COUNT(*) FILTER (WHERE status = 'won') AS won_leads,
        COUNT(*) FILTER (WHERE status = 'lost') AS lost_leads,
        COALESCE(SUM(estimated_value) FILTER (WHERE status NOT IN ('won', 'lost')), 0) AS pipeline_value,
        COALESCE(SUM(estimated_value) FILTER (WHERE status = 'won'), 0) AS won_value,
        COALESCE(AVG(estimated_value) FILTER (WHERE status = 'won'), 0) AS avg_deal_size
      FROM leads WHERE created_by = $1`,
      [req.user.id]
    );
    const row = result.rows[0];
    const total = Number(row.won_leads) + Number(row.lost_leads);
    res.json({
      ...row,
      win_rate: total > 0 ? (Number(row.won_leads) / total * 100).toFixed(1) : null,
    });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch metrics' } });
  }
});

// GET /api/pipeline/:id — single lead
router.get('/:id', param('id').isUUID(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Invalid ID' } });

  try {
    const result = await db.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Lead not found' } });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch lead' } });
  }
});

// POST /api/pipeline — create lead
router.post('/',
  body('company_name').trim().notEmpty(),
  body('contact_name').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Company and contact name required' } });

    const { company_name, contact_name, contact_email, contact_phone, service_pillar, estimated_value, notes, source } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO leads (company_name, contact_name, contact_email, contact_phone, service_pillar, estimated_value, notes, source, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [company_name, contact_name, contact_email || null, contact_phone || null, service_pillar || null, estimated_value || null, notes || null, source || null, req.user.id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: { message: 'Failed to create lead' } });
    }
  }
);

// PUT /api/pipeline/:id — update lead
router.put('/:id', param('id').isUUID(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Invalid ID' } });

  const { company_name, contact_name, contact_email, contact_phone, service_pillar, estimated_value, notes, source, next_follow_up, status } = req.body;
  try {
    const result = await db.query(
      `UPDATE leads SET
        company_name = COALESCE($1, company_name),
        contact_name = COALESCE($2, contact_name),
        contact_email = COALESCE($3, contact_email),
        contact_phone = COALESCE($4, contact_phone),
        service_pillar = COALESCE($5, service_pillar),
        estimated_value = COALESCE($6, estimated_value),
        notes = COALESCE($7, notes),
        source = COALESCE($8, source),
        next_follow_up = COALESCE($9, next_follow_up),
        status = COALESCE($10, status),
        updated_at = NOW()
      WHERE id = $11 RETURNING *`,
      [company_name, contact_name, contact_email, contact_phone, service_pillar, estimated_value, notes, source, next_follow_up, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Lead not found' } });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to update lead' } });
  }
});

// PUT /api/pipeline/:id/stage — update stage only
router.put('/:id/stage',
  param('id').isUUID(),
  body('status').isIn(VALID_STATUSES),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Invalid status' } });

    try {
      const result = await db.query(
        `UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [req.body.status, req.params.id]
      );
      if (!result.rows.length) return res.status(404).json({ error: { message: 'Lead not found' } });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: { message: 'Failed to update stage' } });
    }
  }
);

// DELETE /api/pipeline/:id — delete lead
router.delete('/:id', param('id').isUUID(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Invalid ID' } });

  try {
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Lead not found' } });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to delete lead' } });
  }
});

module.exports = router;
