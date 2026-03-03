-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Business category enum
CREATE TYPE business_category AS ENUM ('restaurant', 'business');

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category business_category NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  website TEXT,
  cover_image_url TEXT,
  avg_overall_rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(address, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(city, '')), 'C')
  ) STORED
);

CREATE INDEX businesses_fts_idx ON businesses USING GIN (fts);
CREATE INDEX businesses_category_idx ON businesses (category);
CREATE INDEX businesses_location_idx ON businesses (latitude, longitude);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_display_name TEXT NOT NULL,
  overall_rating SMALLINT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX reviews_business_idx ON reviews (business_id);
CREATE INDEX reviews_user_idx ON reviews (user_id);
CREATE INDEX reviews_created_idx ON reviews (created_at DESC);

-- Review ratings (sub-criteria scores)
CREATE TABLE review_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  compartment TEXT NOT NULL,
  criterion TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  UNIQUE (review_id, compartment, criterion)
);

CREATE INDEX review_ratings_review_idx ON review_ratings (review_id);

-- Review images
CREATE TABLE review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT DEFAULT 'general',
  display_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX review_images_review_idx ON review_images (review_id);

-- Comments on reviews
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_display_name TEXT NOT NULL,
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) >= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX comments_review_idx ON comments (review_id);

-- Trigger to auto-update business avg rating
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses
  SET
    avg_overall_rating = (
      SELECT COALESCE(AVG(overall_rating), 0)
      FROM reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating();

-- Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses_read" ON businesses FOR SELECT USING (true);
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "review_ratings_read" ON review_ratings FOR SELECT USING (true);
CREATE POLICY "review_ratings_insert" ON review_ratings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM reviews WHERE id = review_id AND user_id = auth.uid())
  );
CREATE POLICY "review_images_read" ON review_images FOR SELECT USING (true);
CREATE POLICY "review_images_insert" ON review_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM reviews WHERE id = review_id AND user_id = auth.uid())
  );
CREATE POLICY "comments_read" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Full-text search function
CREATE OR REPLACE FUNCTION search_businesses(search_term TEXT, category_filter business_category DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category business_category,
  address TEXT,
  city TEXT,
  avg_overall_rating NUMERIC,
  review_count INTEGER,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id, b.name, b.category, b.address, b.city,
    b.avg_overall_rating, b.review_count,
    b.latitude, b.longitude,
    ts_rank(b.fts, websearch_to_tsquery('english', search_term)) AS rank
  FROM businesses b
  WHERE
    b.fts @@ websearch_to_tsquery('english', search_term)
    AND (category_filter IS NULL OR b.category = category_filter)
  ORDER BY rank DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
