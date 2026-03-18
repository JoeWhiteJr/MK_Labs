const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireProjectAccess } = require('../middleware/auth');

const router = express.Router();

// Helper: verify user has access to category's project
async function verifyCategoryAccess(categoryId, userId, role) {
  if (role === 'admin') return true;
  const cat = await db.query('SELECT project_id FROM categories WHERE id = $1', [categoryId]);
  if (cat.rows.length === 0) return false;
  const access = await db.query('SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2 LIMIT 1', [cat.rows[0].project_id, userId]);
  return access.rows.length > 0;
}

// Get all categories for a project
router.get('/project/:projectId', authenticate, requireProjectAccess(), async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;

    const countResult = await db.query(
      'SELECT COUNT(*) FROM categories WHERE project_id = $1',
      [req.params.projectId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM action_items WHERE category_id = c.id) as action_count
      FROM categories c
      WHERE c.project_id = $1
      ORDER BY c.name ASC
      LIMIT $2 OFFSET $3
    `, [req.params.projectId, limit, offset]);

    res.json({ categories: result.rows, total, limit, offset });
  } catch (error) {
    next(error);
  }
});

// Create category for a project
router.post('/project/:projectId', authenticate, [
  body('name').trim().notEmpty().isLength({ max: 50 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/)
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', details: errors.array() } });
    }

    const { name, color } = req.body;
    const projectId = req.params.projectId;

    // Check if project exists
    const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    // Check for duplicate category name in this project
    const existingCheck = await db.query(
      'SELECT id FROM categories WHERE project_id = $1 AND LOWER(name) = LOWER($2)',
      [projectId, name]
    );
    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ error: { message: 'A category with this name already exists in the project' } });
    }

    const result = await db.query(
      'INSERT INTO categories (project_id, name, color) VALUES ($1, $2, $3) RETURNING *',
      [projectId, name, color || '#6366f1']
    );

    res.status(201).json({ category: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update category
router.put('/:id', authenticate, [
  body('name').optional().trim().notEmpty().isLength({ max: 50 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/)
], async (req, res, next) => {
  try {
    if (!(await verifyCategoryAccess(req.params.id, req.user.id, req.user.role))) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', details: errors.array() } });
    }

    const { name, color } = req.body;

    // Get existing category
    const existing = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Category not found' } });
    }

    const category = existing.rows[0];

    // If name is changing, check for duplicates
    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      const duplicateCheck = await db.query(
        'SELECT id FROM categories WHERE project_id = $1 AND LOWER(name) = LOWER($2) AND id != $3',
        [category.project_id, name, req.params.id]
      );
      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ error: { message: 'A category with this name already exists in the project' } });
      }
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) { updates.push(`name = $${paramCount++}`); values.push(name); }
    if (color !== undefined) { updates.push(`color = $${paramCount++}`); values.push(color); }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No fields to update' } });
    }

    values.push(req.params.id);
    const result = await db.query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({ category: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete category
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!(await verifyCategoryAccess(req.params.id, req.user.id, req.user.role))) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    // Null out category_id on affected action items before deleting
    await db.query('UPDATE action_items SET category_id = NULL WHERE category_id = $1', [req.params.id]);

    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Category not found' } });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
