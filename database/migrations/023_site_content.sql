-- Site Content CMS tables
-- Stores editable public site content with JSON values

CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

CREATE TABLE IF NOT EXISTS public_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  title VARCHAR(255),
  bio TEXT DEFAULT '',
  category VARCHAR(50) NOT NULL DEFAULT 'member',
  email VARCHAR(255),
  linkedin_url VARCHAR(500),
  photo_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, category)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section, key);
CREATE INDEX IF NOT EXISTS idx_public_team_category ON public_team_members(category);
CREATE INDEX IF NOT EXISTS idx_public_team_visible ON public_team_members(is_visible);
CREATE INDEX IF NOT EXISTS idx_public_team_order ON public_team_members(display_order);

-- Updated-at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS public_team_members_updated_at ON public_team_members;
CREATE TRIGGER public_team_members_updated_at
  BEFORE UPDATE ON public_team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed hero content
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'main', '{"title": "Michael Kairos Labs", "tagline": "Research. Analytics. Impact.", "description": "Boutique research and analytics consultancy delivering Oxford-caliber rigor at fair prices for mission-driven organizations.", "primaryCta": {"label": "Our Services", "path": "/services"}, "secondaryCta": {"label": "Schedule a Call", "path": "/contact"}}'),
  ('stats', 'main', '[{"number": "3", "label": "Service Pillars"}, {"number": "7", "label": "Core Services"}, {"number": "2", "label": "Founding Partners"}]'),
  ('about', 'summary', '{"label": "About Us", "title": "Research & Analytics for Mission-Driven Organizations", "description": "Michael Kairos Labs delivers rigorous statistical analysis, data intelligence, and operational insights. We combine Oxford-caliber methodology with practical delivery at fair prices.", "highlights": ["MaxDiff & Conjoint Analysis", "UX/Usability Research", "AI Integration & Automation", "Impact Measurement"], "cta": {"label": "Learn More About Us", "path": "/about"}}'),
  ('about', 'page', '{"hero": {"title": "About Us", "subtitle": "Research & analytics consulting with Oxford-caliber rigor"}, "mission": {"title": "Our Mission", "lead": "Michael Kairos Labs exists to make world-class research and analytics accessible to mission-driven organizations.", "description": "We partner with businesses, nonprofits, and government agencies to deliver rigorous, actionable insights that drive real impact."}}'),
  ('contact', 'main', '{"email": "jmw@michaelkairoslabs.com", "phone": "", "phoneRaw": "", "address": "", "city": "", "state": "", "zip": "", "officeHours": "Monday - Friday: 9:00 AM - 5:00 PM", "googleMapsUrl": ""}'),
  ('faq', 'main', '[{"question": "How long does a typical project take?", "answer": "Project timelines vary based on scope and complexity. Simple analyses may take 2-4 weeks, while comprehensive research projects can span several months. We provide clear timelines in every proposal."}, {"question": "What does it cost to work with MKL?", "answer": "We offer competitive, transparent pricing. Every engagement starts with a free discovery call, followed by a detailed proposal with clear scope and investment."}, {"question": "How is MKL different from Big Four firms?", "answer": "Senior-led delivery (not junior consultants), specialized research methodology expertise, Oxford-caliber rigor, and fair pricing without the overhead."}, {"question": "What industries do you work with?", "answer": "We work across sectors including government, healthcare, education, nonprofits, technology, and business. If you have data or research challenges, we''d love to discuss how we can help."}]'),
  ('services', 'main', '[{"icon": "BarChart3", "title": "MaxDiff & Conjoint", "description": "Advanced choice modeling for product and pricing decisions"}, {"icon": "MonitorSmartphone", "title": "UX Research", "description": "Usability studies, SUS scoring, and user experience evaluation"}, {"icon": "Brain", "title": "Psychometrics", "description": "Instrument development, validation, and reliability testing"}, {"icon": "Cpu", "title": "AI Integration", "description": "Intelligent automation and AI-powered workflow solutions"}, {"icon": "TrendingUp", "title": "Statistical Modeling", "description": "Regression, causal inference, and advanced forecasting"}, {"icon": "Workflow", "title": "Process Mapping", "description": "Workflow optimization and bottleneck identification"}, {"icon": "Calculator", "title": "Impact Measurement", "description": "SROI, IRIS+, and comprehensive impact framework analysis"}]')
ON CONFLICT (section, key) DO NOTHING;

-- Seed team members
INSERT INTO public_team_members (name, role, title, bio, category, email, linkedin_url, display_order) VALUES
  ('Joseph White', 'Co-Founder', NULL, 'Co-founder of Michael Kairos Labs. Research operations and analytics leadership.', 'leadership', 'jmw@michaelkairoslabs.com', '#', 1),
  ('Jared Williams', 'Co-Founder', NULL, 'Co-founder of Michael Kairos Labs. Strategy and client engagement.', 'leadership', NULL, '#', 2)
ON CONFLICT (name, category) DO NOTHING;
