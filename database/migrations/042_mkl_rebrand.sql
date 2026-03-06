-- MKL Rebrand: Add consulting-specific columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS service_pillar TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS engagement_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget NUMERIC(10,2);

-- Add 'client' to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'client';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'member';
