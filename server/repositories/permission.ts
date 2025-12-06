import { db } from '../utils/db';

export const permissionRepository = {
  async findByGroupId(groupId: string) {
    const [rows]: any = await db.query(
      `SELECT p.subject, p.action
       FROM group_permissions gp
       JOIN permissions p ON gp.permission_id = p.id
       WHERE gp.group_id = UUID_TO_BIN(?, 1)`,
      [groupId],
    );

    return rows;
  },

  async findByUserId(id: string) {
    const [rows]: any = await db.query(
      `
      SELECT DISTINCT
  p.subject,
  p.action
FROM user_groups ug
JOIN group_permissions gp ON gp.group_id = ug.group_id
JOIN permissions p ON p.id = gp.permission_id
WHERE ug.user_id = UUID_TO_BIN(?, 1)`,
      [id],
    );

    return rows;
  },

  async findBySubjectAndAction(subject: string, action: string) {
    const [rows]: any = await db.query(
      `SELECT id FROM permissions WHERE subject = ? AND action = ?`,
      [subject, action],
    );
    return rows.length ? rows[0] : null;
  },

  async clearPermissions(groupId: string) {
    await db.query(`DELETE FROM group_permissions WHERE group_id = UUID_TO_BIN(?, 1)`, [groupId]);
  },

  async addPermission(groupId: string, permissionId: number) {
    await db.query(
      `INSERT INTO group_permissions (group_id, permission_id) VALUES (UUID_TO_BIN(?, 1), ?)`,
      [groupId, permissionId],
    );
  },
};
