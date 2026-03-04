-- Add premium and ownership fields to businesses
ALTER TABLE businesses ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE businesses ADD COLUMN owner_user_id UUID;

-- Owner responses table
CREATE TABLE owner_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_display_name TEXT NOT NULL,
  response_text TEXT NOT NULL CHECK (char_length(response_text) >= 1),
  image_url TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id)
);

CREATE INDEX owner_responses_review_idx ON owner_responses (review_id);
CREATE INDEX owner_responses_business_idx ON owner_responses (business_id);

-- RLS
ALTER TABLE owner_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can read owner responses
CREATE POLICY "owner_responses_read" ON owner_responses
  FOR SELECT USING (true);

-- Only the business owner of a premium business can insert
CREATE POLICY "owner_responses_insert" ON owner_responses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM businesses
      WHERE id = business_id
        AND owner_user_id = auth.uid()
        AND is_premium = true
    )
  );

-- Only the business owner can update their own response
CREATE POLICY "owner_responses_update" ON owner_responses
  FOR UPDATE USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM businesses
      WHERE id = business_id
        AND owner_user_id = auth.uid()
        AND is_premium = true
    )
  );

-- Only the business owner can delete their own response
CREATE POLICY "owner_responses_delete" ON owner_responses
  FOR DELETE USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM businesses
      WHERE id = business_id
        AND owner_user_id = auth.uid()
    )
  );
