import { db } from '../utils/db';
import { BaseRepository } from './base';

class GroupRepository extends BaseRepository {
  constructor() {
    super(
      'groups',
      ['sort', 'updated_at'],
      ['name', 'description'],
      ['name', 'description', 'sort', 'updated_at'],
    );
  }

  async clearPermissions(groupId: string) {
    await db.query(`DELETE FROM group_permissions WHERE group_id = UUID_TO_BIN(?, 1)`, [groupId]);
  }

  async addPermission(groupId: string, permissionId: number) {
    await db.query(
      `INSERT INTO group_permissions (group_id, permission_id) VALUES (UUID_TO_BIN(?, 1), ?)`,
      [groupId, permissionId],
    );
  }
}

export const groupRepository = new GroupRepository();
