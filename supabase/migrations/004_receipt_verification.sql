-- Receipt verification
-- Lets a reviewer attach a receipt right after posting so their review can be
-- fast-tracked to a "Verified Visit" badge instead of waiting in the manual queue.

ALTER TABLE reviews
  ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  ADD COLUMN receipt_storage_path TEXT,
  ADD COLUMN receipt_url TEXT,
  ADD COLUMN receipt_total NUMERIC(10, 2),
  ADD COLUMN receipt_dated_on DATE,
  ADD COLUMN verification_confidence SMALLINT
    CHECK (verification_confidence IS NULL OR (verification_confidence >= 0 AND verification_confidence <= 100)),
  ADD COLUMN verified_at TIMESTAMPTZ;

CREATE INDEX reviews_verification_idx ON reviews (verification_status);

-- The reviewer can attach / update their own receipt verification fields.
-- (reviews_update already restricts UPDATE to auth.uid() = user_id.)
