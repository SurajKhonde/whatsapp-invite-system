import { pool } from "@config/db";

export const bulkInsertGuests = async (
  hostId: string,
  guests: any[]
) => {
  const values: any[] = [];
  const placeholders: string[] = [];

  guests.forEach((g, i) => {
    const idx = i * 4;

    placeholders.push(
      `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`
    );

    values.push(hostId, g.name, g.phone, g.relation);
  });

  const query = `
    INSERT INTO guests (host_id, name, phone, relation)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

export const getGuestsByHost = async (hostId: string) => {
  const result = await pool.query(
    `SELECT * FROM guests 
     WHERE host_id = $1
     ORDER BY created_at DESC`,
    [hostId]
  );

  return result.rows;
};