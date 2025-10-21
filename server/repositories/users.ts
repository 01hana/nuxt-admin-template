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

  /**
   * 取得符合 filters.groups 篩選的 userId
   */
  private async findUserIdsByGroups(groups: string[]) {
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

  /**
   * 查詢使用者群組
   */
  private async findUserGroups(filterUsers: any[]): Promise<any[]> {
    // 抓出所有使用者 ID
    const userIds = filterUsers.map((user: { id: string }) => user.id);

    // 查詢使用者群組
    const [groupRows]: any = await db.query(
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

    const groupMap: Record<string, string[]> = {};
    for (const row of groupRows) {
      if (!groupMap[row.user_id]) groupMap[row.user_id] = [];

      groupMap[row.user_id].push(row.name);
    }

    // 合併群組與狀態轉換
    const mergedData = filterUsers.map((user: any) => ({
      ...user,
      status: user.status === 1 ? true : false,
      groups: groupMap[user.id] || [],
    }));

    return mergedData;
  }

  /**
   * 分頁查詢 + 群組篩選
   */
  async getTable(body: any) {
    const [sortField, sortOrder] = body.sort || ['updated_at', 'desc'];
    const keyword = body.searches?.keyword || '';
    const filters = body.filters || {};
    const p = Number(body.p) || 1;
    const length = Number(body.length) || 35;
    const offset = (p - 1) * length;

    // 先檢查是否有群組篩選
    const targetUserIds = await this.findUserIdsByGroups(filters.groups);

    // 根據篩選條件查詢主表資料
    const { data: users, total } = await this.findAll({
      sortField,
      sortOrder,
      keyword,
      filters: filters,
      length,
      offset,
    });

    // 若有 groups 篩選，進一步過濾結果
    let filteredUsers = users;

    if (targetUserIds) {
      filteredUsers = users.filter((u: any) => targetUserIds!.includes(u.id));
    }

    if (!filteredUsers.length) {
      return { data: [], p, length, total: 0 };
    }

    // 取得使用者關聯群組資料
    const mergedData = await this.findUserGroups(filteredUsers);

    return {
      data: mergedData,
      p,
      length,
      total,
    };
  }

  async getGroups() {
    const [rows]: any = await db.query(`
      SELECT BIN_TO_UUID(id, 1) as id, name as label
      FROM \`groups\`
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
    `);

    return { data: rows };
  }

  async getFilters() {
    const [groups]: any = await db.query(`
      SELECT BIN_TO_UUID(id, 1) as value, name as label
      FROM \`groups\`
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
    `);

    const status = [
      { label: '啟用', value: true },
      { label: '停用', value: false },
    ];

    return { data: { groups, status } };
  }

  async findGroupsByUserId(id: string) {
    const [rows]: any = await db.query(
      `SELECT BIN_TO_UUID(g.id, 1) AS id
       FROM user_groups ug
       JOIN \`groups\` g ON g.id = ug.group_id
       WHERE ug.user_id = UUID_TO_BIN(?, 1)`,
      [id],
    );

    return rows.map((row: any) => row.id);
  }

  async create(data: any) {
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
  async updateUser(id: string, data: any) {
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
