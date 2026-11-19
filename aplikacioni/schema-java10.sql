-- Ekzekutoje ne Neon pasi jane krijuar udhetimet dhe profilet.
CREATE TABLE IF NOT EXISTS kerkesat (
  id BIGSERIAL PRIMARY KEY,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  udhetar_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  emri TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ne_pritje'
    CHECK (status IN ('ne_pritje', 'pranuar', 'refuzuar')),
  krijuar_ne TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  perditesuar_ne TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (udhetim_id, udhetar_id)
);

CREATE INDEX IF NOT EXISTS kerkesat_udhetim_status_idx
  ON kerkesat (udhetim_id, status, krijuar_ne DESC);

SELECT id, udhetim_id, udhetar_id, emri, status, krijuar_ne
FROM kerkesat ORDER BY krijuar_ne DESC;
