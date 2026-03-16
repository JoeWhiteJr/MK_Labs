const express = require('express');
const fs = require('fs');
const db = require('../config/database');
const logger = require('../config/logger');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Valid entity types for trash operations
const ENTITY_TYPES = {
  project: { table: 'projects', titleCol: 'title' },
  note: { table: 'notes', titleCol: 'title' },
  action: { table: 'action_items', titleCol: 'title' },
  meeting: { table: 'meetings', titleCol: 'title' },
  file: { table: 'files', titleCol: 'original_filename' },
};

// Hardcoded allowlist of valid table names — never interpolate user input into SQL
const ALLOWED_TABLES = new Set(['projects', 'notes', 'action_items', 'meetings', 'files']);

/**
 * Returns a safe table name from the entity type, validated against a hardcoded allowlist.
 * Throws if the table name is not in the allowlist, preventing SQL injection.
 */
function getSafeTableName(entityType) {
  const table = entityType.table;
  if (!ALLOWED_TABLES.has(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
  return table;
}

// GET /api/trash - list all trashed items
router.get('/', authenticate, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userId = req.user.id;

    // Query each entity type for trashed items
    const queries = [];

    // Projects
    const projectFilter = isAdmin ? '' : 'AND p.deleted_by = $1';
    queries.push(
      db.query(`
        SELECT p.id, p.title, 'project' as type, NULL as parent_project_id, NULL as project_title,
          p.deleted_at, p.deleted_by, u.name as deleted_by_name
        FROM projects p
        LEFT JOIN users u ON p.deleted_by = u.id
        WHERE p.deleted_at IS NOT NULL ${projectFilter}
      `, isAdmin ? [] : [userId])
    );

    // Notes
    const noteFilter = isAdmin ? '' : 'AND n.deleted_by = $1';
    queries.push(
      db.query(`
        SELECT n.id, n.title, 'note' as type, n.project_id as parent_project_id, p.title as project_title,
          n.deleted_at, n.deleted_by, u.name as deleted_by_name
        FROM notes n
        LEFT JOIN projects p ON n.project_id = p.id
        LEFT JOIN users u ON n.deleted_by = u.id
        WHERE n.deleted_at IS NOT NULL ${noteFilter}
      `, isAdmin ? [] : [userId])
    );

    // Action Items
    const actionFilter = isAdmin ? '' : 'AND a.deleted_by = $1';
    queries.push(
      db.query(`
        SELECT a.id, a.title, 'action' as type, a.project_id as parent_project_id, p.title as project_title,
          a.deleted_at, a.deleted_by, u.name as deleted_by_name
        FROM action_items a
        LEFT JOIN projects p ON a.project_id = p.id
        LEFT JOIN users u ON a.deleted_by = u.id
        WHERE a.deleted_at IS NOT NULL ${actionFilter}
      `, isAdmin ? [] : [userId])
    );

    // Meetings
    const meetingFilter = isAdmin ? '' : 'AND m.deleted_by = $1';
    queries.push(
      db.query(`
        SELECT m.id, m.title, 'meeting' as type, m.project_id as parent_project_id, p.title as project_title,
          m.deleted_at, m.deleted_by, u.name as deleted_by_name
        FROM meetings m
        LEFT JOIN projects p ON m.project_id = p.id
        LEFT JOIN users u ON m.deleted_by = u.id
        WHERE m.deleted_at IS NOT NULL ${meetingFilter}
      `, isAdmin ? [] : [userId])
    );

    // Files
    const fileFilter = isAdmin ? '' : 'AND f.deleted_by = $1';
    queries.push(
      db.query(`
        SELECT f.id, f.original_filename as title, 'file' as type, f.project_id as parent_project_id, p.title as project_title,
          f.deleted_at, f.deleted_by, u.name as deleted_by_name
        FROM files f
        LEFT JOIN projects p ON f.project_id = p.id
        LEFT JOIN users u ON f.deleted_by = u.id
        WHERE f.deleted_at IS NOT NULL ${fileFilter}
      `, isAdmin ? [] : [userId])
    );

    const results = await Promise.all(queries);
    const items = results
      .flatMap(r => r.rows)
      .sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

// POST /api/trash/:type/:id/restore - restore a trashed item
router.post('/:type/:id/restore', authenticate, async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const entityType = ENTITY_TYPES[type];

    if (!entityType) {
      return res.status(400).json({ error: { message: 'Invalid entity type' } });
    }

    // Non-admins can only restore items they deleted
    const isAdmin = req.user.role === 'admin';
    let query;
    let params;

    const tableName = getSafeTableName(entityType);

    if (isAdmin) {
      query = `UPDATE ${tableName} SET deleted_at = NULL, deleted_by = NULL WHERE id = $1 AND deleted_at IS NOT NULL RETURNING id`;
      params = [id];
    } else {
      query = `UPDATE ${tableName} SET deleted_at = NULL, deleted_by = NULL WHERE id = $1 AND deleted_at IS NOT NULL AND deleted_by = $2 RETURNING id`;
      params = [id, req.user.id];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Trashed item not found' } });
    }

    res.json({ message: 'Item restored successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/trash/:type/:id - permanently delete a trashed item
router.delete('/:type/:id', authenticate, async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const entityType = ENTITY_TYPES[type];

    if (!entityType) {
      return res.status(400).json({ error: { message: 'Invalid entity type' } });
    }

    const isAdmin = req.user.role === 'admin';
    const tableName = getSafeTableName(entityType);

    // Verify item is in trash and user has permission
    let checkQuery;
    let checkParams;

    if (isAdmin) {
      checkQuery = `SELECT * FROM ${tableName} WHERE id = $1 AND deleted_at IS NOT NULL`;
      checkParams = [id];
    } else {
      checkQuery = `SELECT * FROM ${tableName} WHERE id = $1 AND deleted_at IS NOT NULL AND deleted_by = $2`;
      checkParams = [id, req.user.id];
    }

    const checkResult = await db.query(checkQuery, checkParams);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Trashed item not found' } });
    }

    const item = checkResult.rows[0];

    if (type === 'project') {
      // Cascade-delete all child items in a transaction
      const client = await db.getClient();
      try {
        await client.query('BEGIN');

        // Delete files on disk for meetings in this project
        const meetingFiles = await client.query(
          'SELECT audio_path FROM meetings WHERE project_id = $1 AND audio_path IS NOT NULL',
          [id]
        );
        for (const row of meetingFiles.rows) {
          fs.unlink(row.audio_path, () => {});
        }

        // Delete files on disk for files in this project
        const projectFiles = await client.query(
          'SELECT storage_path FROM files WHERE project_id = $1 AND storage_path IS NOT NULL',
          [id]
        );
        for (const row of projectFiles.rows) {
          fs.unlink(row.storage_path, () => {});
        }

        // Delete child records
        await client.query('DELETE FROM action_item_assignees WHERE action_item_id IN (SELECT id FROM action_items WHERE project_id = $1)', [id]);
        await client.query('DELETE FROM action_items WHERE project_id = $1', [id]);
        await client.query('DELETE FROM notes WHERE project_id = $1', [id]);
        await client.query('DELETE FROM meetings WHERE project_id = $1', [id]);
        await client.query('DELETE FROM files WHERE project_id = $1', [id]);
        await client.query('DELETE FROM project_members WHERE project_id = $1', [id]);
        await client.query('DELETE FROM project_join_requests WHERE project_id = $1', [id]);
        await client.query('DELETE FROM projects WHERE id = $1', [id]);

        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      // Delete file from disk for meetings and files
      if (type === 'meeting' && item.audio_path) {
        fs.unlink(item.audio_path, (err) => {
          if (err) logger.error({ err }, 'Error deleting audio file');
        });
      }
      if (type === 'file' && item.storage_path) {
        fs.unlink(item.storage_path, (err) => {
          if (err) logger.error({ err }, 'Error deleting file');
        });
      }

      // For action items, also delete assignees
      if (type === 'action') {
        await db.query('DELETE FROM action_item_assignees WHERE action_item_id = $1', [id]);
      }

      await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
    }

    res.json({ message: 'Item permanently deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
