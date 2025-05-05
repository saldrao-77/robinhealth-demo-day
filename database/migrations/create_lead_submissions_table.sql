-- Create the lead_submissions table
CREATE TABLE IF NOT EXISTS lead_submissions (
  id SERIAL PRIMARY KEY,
  zip_code VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  imaging_type VARCHAR(50) NOT NULL,
  body_part VARCHAR(100),
  has_order BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS lead_submissions_created_at_idx ON lead_submissions(created_at);

-- Create an index on processed for filtering unprocessed leads
CREATE INDEX IF NOT EXISTS lead_submissions_processed_idx ON lead_submissions(processed);
