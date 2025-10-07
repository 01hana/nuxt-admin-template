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

  async findBySubjectAndAction(subject: string, action: string) {
    const [rows]: any = await db.query(
      `SELECT id FROM permissions WHERE subject = ? AND action = ?`,
      [subject, action],
    );
    return rows.length ? rows[0] : null;
  },
};
