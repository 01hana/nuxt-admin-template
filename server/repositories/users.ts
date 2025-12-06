import { BaseRepository } from './base';
import { db } from '../utils/db';

class UserRepository extends BaseRepository {
  constructor() {
    super(
      'users',
      ['updated_at'],
      ['account', 'name', 'email'],
      ['account', 'name', 'email', 'status', 'updated_at'],
    );
  }

  private uniqueTranslate = {
    email: 'Email',
    account: '帳號',
    name: '使用者名稱',
  };

  public async findByAccount(account: string) {
    const [rows]: any = await db.query(
      `SELECT 
        BIN_TO_UUID(id,1) AS id,
        account,
        name,
        email,
        password,
        status
     FROM users
     WHERE account = ?
     LIMIT 1`,
      [account],
    );

    return rows[0] || null;
  }

  public async findById(id: string, options?: { withPassword?: boolean }) {
    if (!options?.withPassword) {
      return super.findById(id);
    }

    // 特殊需求：要撈 password
    const [rows]: any = await db.query(
      `
      SELECT 
        BIN_TO_UUID(id,1) AS id,
        account,
        name,
        email,
        password,
        status,
        created_at,
        updated_at
      FROM users
      WHERE id = UUID_TO_BIN(?, 1)
    `,
      [id],
    );

    const user = rows[0] || null;

    if (user) {
      user.status = user.status === 1;
    }

    return user;
  }

  /**
   * 取得符合 filters.groups 篩選的 userId
   */
  public async findByGroups(groups: string[]) {
    if (!groups?.length) return;

    const [rows]: any = await db.query(
      `
      SELECT DISTINCT BIN_TO_UUID(user_id, 1) AS user_id
      FROM user_groups
      WHERE group_id IN (${groups.map(() => 'UUID_TO_BIN(?, 1)').join(',')})
      `,
      groups,
    );

    const targetUserIds = rows.map((row: any) => row.user_id);

    return targetUserIds;
  }

  public async create(data: any) {
    // 先做 UNIQUE 檢查
    await this.checkUnique(data, ['email', 'account', 'name'], this.uniqueTranslate);

    const { account, name, email, status, groups } = data;

    // 建立 UUID
    const [[{ id }]]: any = await db.query('SELECT UUID() AS id');

    // 插入使用者
    await this.insert({
      id,
      account,
      name,
      email,
      status,
    });

    // 綁定使用者和群組關聯
    if (!Array.isArray(groups)) return;

    for (const groupId of groups) {
      await db.query(
        `INSERT INTO user_groups (user_id, group_id) 
           VALUES (UUID_TO_BIN(?, 1), UUID_TO_BIN(?, 1))`,
        [id, groupId],
      );
    }

    return {
      id,
      account,
      name,
      email,
      status,
      groups: groups || [],
    };
  }

  // 更新使用者資料 + 群組關聯
  public async updateUser(id: string, data: any) {
    await this.checkUnique(data, ['email', 'account', 'name'], this.uniqueTranslate, id);

    const { name, email, status, groups } = data;

    // 更新使用者資料
    await this.update(id, {
      name,
      email,
      status,
    });

    // 只有當前端有傳 groups 時，才處理群組關聯
    if (Array.isArray(groups)) {
      // 先清空原本的關聯
      await db.query('DELETE FROM user_groups WHERE user_id = UUID_TO_BIN(?, 1)', [id]);

      // 再建立新的群組關聯
      if (groups.length > 0) {
        const insertValues = groups.map(() => '(UUID_TO_BIN(?, 1), UUID_TO_BIN(?, 1))').join(',');

        const params: any[] = [];

        groups.forEach(gid => params.push(id, gid));
        await db.query(
          `INSERT INTO user_groups (user_id, group_id) VALUES ${insertValues}`,
          params,
        );
      }
    }

    // 回傳更新後的完整資料
    const [users]: any = await db.query(
      `
      SELECT 
        BIN_TO_UUID(id, 1) AS id,
        account,
        name,
        email,
        IF(status = 1, true, false) AS status,
        created_at,
        updated_at
      FROM users
      WHERE id = UUID_TO_BIN(?, 1)
      `,
      [id],
    );

    // 查詢使用者所屬群組名稱
    const [groupRows]: any = await db.query(
      `
      SELECT g.name
      FROM user_groups ug
      JOIN \`groups\` g ON g.id = ug.group_id
      WHERE ug.user_id = UUID_TO_BIN(?, 1)
      `,
      [id],
    );

    const groupNames = groupRows.map((row: any) => row.name);

    return {
      data: {
        ...users[0],
        groups: groupNames,
      },
    };
  }
}

export const userRepository = new UserRepository();
