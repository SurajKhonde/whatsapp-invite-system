import { pool } from "@config/db";
import { encrypt } from "@utils/encrptContact";
import { decrypt } from "@utils/encrptContact";
export const bulkInsertGuests = async (
  hostId: string,
  guests: any[]
) => {
  const values: any[] = [];
  const placeholders: string[] = [];

  guests.forEach((g, i) => {
    const idx = i * 5;

    placeholders.push(
      `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`
    );

    const phone = String(g.phone).trim();
    const encryptedPhone = encrypt(phone);
    const last4 = phone.slice(-4); // 🔥 store last 4

    values.push(hostId, g.name, encryptedPhone, g.relation, last4);
  });

  const query = `
    INSERT INTO guests (host_id, name, phone, relation, phone_last4)
    VALUES ${placeholders.join(", ")}
    RETURNING id, host_id, name, relation, phone_last4, created_at;
  `;

  const result = await pool.query(query, values);
  return result.rows;
};
export const getGuestsByHost = async (hostId: string) => {
  const result = await pool.query(
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


export const revealGuestPhones = async (
  hostId: string,
  guestIds: string[]
) => {
  const result = await pool.query(
    `SELECT id, phone
     FROM guests
     WHERE host_id = $1 AND id = ANY($2)`,
    [hostId, guestIds]
  );

  return result.rows.map((g) => ({
    id: g.id,
    phone: decrypt(g.phone), 
  }));
};