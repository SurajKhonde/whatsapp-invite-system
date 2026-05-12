import { pool }    from "@config/db";
import { encrypt, decrypt } from "@utils/encrptContact";

// ── Types ────────────────────────────────────────────────
export type GuestInput = {
  name:     string;
  phone:    string;
  relation: string;
};

export type GuestRow = {
  id:          string;
  hostId:     string;
  name:        string;
  relation:    string;
  phone_last4: string;
  created_at:  Date;
};

export type GuestWithMaskedPhone = GuestRow & {
  phone: string;   // masked "+91*****1234"
};

export type RevealedGuest = {
  id:    string;
  phone: string;   // decrypted real phone
};

// ── Bulk insert ──────────────────────────────────────────
export const bulkInsertGuests = async (
  hostId: string,
  guests: GuestInput[]
): Promise<GuestRow[]> => {

  const values:       (string)[] = [];
  const placeholders: string[]   = [];

  guests.forEach((g, i) => {
    const idx          = i * 5;
    const phone        = String(g.phone).trim();
    const encryptedPhone = encrypt(phone);
    const last4        = phone.slice(-4);

    placeholders.push(
      `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`
    );

    values.push(hostId, g.name, encryptedPhone, g.relation ?? "friend", last4);
  });

  const query = `
    INSERT INTO guests (host_id, name, phone, relation, phone_last4)
    VALUES ${placeholders.join(", ")}
    RETURNING id, host_id, name, relation, phone_last4, created_at;
  `;

  const result = await pool.query<GuestRow>(query, values);
  return result.rows;
};

// ── Get all guests for a host (masked phone) ─────────────
export const getGuestsByHost = async (
  hostId: string
): Promise<GuestWithMaskedPhone[]> => {
  const result = await pool.query<GuestRow>(
    `SELECT id, host_id, name, relation, phone_last4, created_at
     FROM guests
     WHERE host_id = $1
     ORDER BY created_at DESC`,
    [hostId]
  );

  return result.rows.map((g) => ({
    ...g,
    phone: `+91*****${g.phone_last4}`,
  }));
};

// ── Reveal real phones for worker use only ───────────────
export const revealGuestPhones = async (
  hostId:   string,
  guestIds: string[]
): Promise<RevealedGuest[]> => {

  const result = await pool.query<{ id: string; phone: string }>(
    `SELECT id, phone
     FROM guests
     WHERE host_id = $1 AND id = ANY($2)`,
    [hostId, guestIds]
  );

  return result.rows.map((g) => ({
    id:    g.id,
    phone: decrypt(g.phone),
  }));
};

export const getGuestById = async (
  guestId: string
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      phone
    FROM guests
    WHERE id = $1
    LIMIT 1
    `,
    [guestId]
  );

  if (!result.rows[0]) {
    return null;
  }

  const guest = result.rows[0];

  return {
    id: guest.id,
    name: guest.name,
    phone: decrypt(guest.phone),
  };
};