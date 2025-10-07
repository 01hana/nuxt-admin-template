import { db } from '../../../utils/db';

export default defineEventHandler(async () => {
  const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');

  return JSON.parse(JSON.stringify(rows)); // 確保是純 JSON
});
