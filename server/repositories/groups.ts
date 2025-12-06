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

  public async getGroups() {
    const [rows]: any = await db.query(`
      SELECT BIN_TO_UUID(id, 1) as value, name as label
      FROM \`groups\`
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
    `);

    return { data: rows };
  }

  /**
   * 查詢使用者群組
   */
  public async findByUserIds(userIds: string[]) {
    if (!userIds.length) return [];

    const [rows]: any = await db.query(
      `
      SELECT 
      BIN_TO_UUID(ug.user_id, 1) AS user_id,
      BIN_TO_UUID(g.id, 1) AS id,
      g.name
    FROM user_groups ug
    JOIN \`groups\` g ON g.id = ug.group_id
    WHERE ug.user_id IN (${userIds.map(() => 'UUID_TO_BIN(?, 1)').join(',')})
      `,
      userIds,
    );

    return rows;
  }

  public async findByUserId(userIds: string) {
    const [rows]: any = await db.query(
      `SELECT BIN_TO_UUID(g.id, 1) AS id
       FROM user_groups ug
       JOIN \`groups\` g ON g.id = ug.group_id
       WHERE ug.user_id = UUID_TO_BIN(?, 1)`,
      [userIds],
    );

    return rows.map((row: any) => row.id);
  }
}

export const groupRepository = new GroupRepository();
