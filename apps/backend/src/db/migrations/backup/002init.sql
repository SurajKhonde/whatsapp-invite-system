CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  host_id UUID NOT NULL, -- 🔥 FK to users

  name TEXT NOT NULL,
  phone TEXT NOT NULL, -- with country code

  relation TEXT DEFAULT 'friend',

  status TEXT DEFAULT 'ACTIVE', -- ACTIVE | BLOCKED

  invite_count INTEGER DEFAULT 0,
  last_invited_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),

  CONSTRAINT fk_host
    FOREIGN KEY (host_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- 🔥 indexes (important)
CREATE INDEX idx_guests_host ON guests(host_id);
CREATE INDEX idx_guests_phone ON guests(phone);