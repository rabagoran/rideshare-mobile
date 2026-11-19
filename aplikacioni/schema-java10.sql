-- Ekzekutoje ne Neon pasi jane krijuar udhetimet dhe profilet.
ALTER TABLE udhetimet
  ADD COLUMN IF NOT EXISTS shofer_id TEXT REFERENCES profilet(github_id);

CREATE TABLE IF NOT EXISTS kerkesat (
  id BIGSERIAL PRIMARY KEY,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  udhetar_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  emri TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ne_pritje'
    CHECK (status IN ('ne_pritje', 'pranuar', 'refuzuar')),
  krijuar_ne TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  perditesuar_ne TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lejon ridergimin pas refuzimit, por vetem nje kerkese ne pritje/pranuar per udhetar-udhetim.
ALTER TABLE kerkesat
  DROP CONSTRAINT IF EXISTS kerkesat_udhetim_id_udhetar_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS kerkesat_one_active_per_rider_idx
  ON kerkesat (udhetim_id, udhetar_id)
  WHERE status IN ('ne_pritje', 'pranuar');

CREATE INDEX IF NOT EXISTS kerkesat_udhetim_status_idx
  ON kerkesat (udhetim_id, status, krijuar_ne DESC);

SELECT id, udhetim_id, udhetar_id, emri, status, krijuar_ne
FROM kerkesat ORDER BY krijuar_ne DESC;
