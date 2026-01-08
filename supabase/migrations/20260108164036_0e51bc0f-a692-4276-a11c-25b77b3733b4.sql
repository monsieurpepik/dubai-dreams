-- Add post-handover payment plan details
ALTER TABLE properties ADD COLUMN post_handover_years INTEGER DEFAULT NULL;
ALTER TABLE properties ADD COLUMN post_handover_percent INTEGER DEFAULT NULL;

-- Add construction stage tracking
ALTER TABLE properties ADD COLUMN construction_stage TEXT DEFAULT 'pre-launch';
-- Values: 'pre-launch', 'foundation', 'structure', 'finishing', 'ready'
ALTER TABLE properties ADD COLUMN construction_percent INTEGER DEFAULT 0;