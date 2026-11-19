CREATE TABLE IF NOT EXISTS preferimet (
  github_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  krijuar_ne TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (github_id, udhetim_id)
);
CREATE INDEX IF NOT EXISTS preferimet_udhetim_id_idx ON preferimet(udhetim_id);
SELECT github_id, udhetim_id, krijuar_ne FROM preferimet ORDER BY krijuar_ne DESC;
