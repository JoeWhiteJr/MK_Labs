-- Soft-delete support: add deleted_at and deleted_by to entity tables
-- Items with deleted_at IS NOT NULL are "trashed" and hidden from normal queries

ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE notes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE action_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE action_items ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE meetings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE files ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE files ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Partial indexes for active rows (most queries)
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notes_active ON notes (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_action_items_active ON action_items (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_meetings_active ON meetings (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_files_active ON files (id) WHERE deleted_at IS NULL;

-- Partial indexes for trashed rows (trash page queries)
CREATE INDEX IF NOT EXISTS idx_projects_trashed ON projects (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_trashed ON notes (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_action_items_trashed ON action_items (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_meetings_trashed ON meetings (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_files_trashed ON files (deleted_at) WHERE deleted_at IS NOT NULL;
