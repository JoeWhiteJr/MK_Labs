-- CRM Pipeline: Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'discovery' CHECK (status IN ('discovery', 'proposal', 'negotiation', 'won', 'lost')),
  service_pillar TEXT,
  estimated_value NUMERIC(10,2),
  notes TEXT,
  source TEXT,
  next_follow_up TIMESTAMPTZ,
  project_id UUID REFERENCES projects(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
