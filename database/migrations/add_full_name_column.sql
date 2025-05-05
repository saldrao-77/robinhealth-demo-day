-- Add full_name column to lead_submissions table
ALTER TABLE lead_submissions ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Create an index on full_name for faster searches
CREATE INDEX IF NOT EXISTS lead_submissions_full_name_idx ON lead_submissions(full_name);
