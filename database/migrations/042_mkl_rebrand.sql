-- MKL Rebrand: Add consulting-specific columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS service_pillar TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS engagement_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget NUMERIC(10,2);

-- Add 'client' to user roles (if role is an enum, alter it; if text, this is just documentation)
-- Most UVRL setups use text for role, so this is a no-op safeguard
DO $$
BEGIN
  -- If there's a check constraint on role, try to update it
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
    ALTER TABLE users ADD CONSTRAINT users_role_check
      CHECK (role IN ('member', 'admin', 'client'));
  END IF;
END $$;
