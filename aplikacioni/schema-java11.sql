-- Ekzekutoje në Neon pasi të jetë ekzekutuar schema-java10.sql.
CREATE TABLE IF NOT EXISTS njoftimet (
  id BIGSERIAL PRIMARY KEY,
  kerkesa_id BIGINT NOT NULL UNIQUE REFERENCES kerkesat(id) ON DELETE CASCADE,
  udhetar_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  tipi TEXT NOT NULL CHECK (tipi IN ('pranuar', 'refuzuar')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS njoftimet_udhetar_created_idx
  ON njoftimet (udhetar_id, created_at DESC);

CREATE INDEX IF NOT EXISTS njoftimet_udhetar_unread_idx
  ON njoftimet (udhetar_id) WHERE read_at IS NULL;
