import { db } from '../utils/db';
import { BaseRepository } from './base';

class GroupRepository extends BaseRepository {
  constructor() {
    super(
      'groups',
      ['name', 'description'],
      ['sort', 'updated_at'],
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

// export const groupRepository = {
//   async findAll(options: {
//     sortField: string;
//     sortOrder: string;
//     keyword: string;
//     filters: { field: string; value: any }[];
//     length: number;
//     offset: number;
//   }) {
//     const { sortField, sortOrder, keyword, filters, length, offset } = options;
//     const params: any[] = [];

//     let sql = `SELECT BIN_TO_UUID(id, 1) as id, name, description, sort, updated_at
//                FROM \`groups\` WHERE deleted_at IS NULL`;

//     // 搜尋
//     if (keyword) {
//       sql += ` AND (name LIKE ? OR description LIKE ?)`;
//       params.push(`%${keyword}%`, `%${keyword}%`);
//     }

//     // 篩選
//     for (const filter of filters) {
//       sql += ` AND ${filter.field} = ?`;
//       params.push(filter.value);
//     }

//     // 排序 (白名單防 SQL injection)
//     const allowedSortFields = ['sort', 'updated_at'];
//     const safeSortField = allowedSortFields.includes(sortField) ? sortField : 'updated_at';
//     const safeSortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
//     sql += ` ORDER BY ${safeSortField} ${safeSortOrder}`;

//     // 分頁
//     sql += ` LIMIT ? OFFSET ?`;
//     params.push(length, offset);

//     const [rows]: any = await db.query(sql, params);
//     return rows;
//   },

//   async countAll(options: { keyword: string; filters: { field: string; value: any }[] }) {
//     const { keyword, filters } = options;
//     const params: any[] = [];

//     let sql = `SELECT COUNT(*) as total FROM \`groups\` WHERE deleted_at IS NULL`;

//     if (keyword) {
//       sql += ` AND (name LIKE ? OR description LIKE ?)`;
//       params.push(`%${keyword}%`, `%${keyword}%`);
//     }

//     for (const filter of filters) {
//       sql += ` AND ${filter.field} = ?`;
//       params.push(filter.value);
//     }

//     const [rows]: any = await db.query(sql, params);

//     return rows[0].total;
//   },

//   async findById(id: string) {
//     const [rows]: any = await db.query(
//       `SELECT BIN_TO_UUID(id, 1) as id, name, description, sort, updated_at
//        FROM \`groups\`
//        WHERE id = UUID_TO_BIN(?, 1)`,
//       [id],
//     );
//     return rows.length ? rows[0] : null;
//   },

//   async update(id: string, data: { name: string; description: string; sort: number }) {
//     await db.query(
//       `UPDATE \`groups\`
//        SET name = ?, description = ?, sort = ?, updated_at = NOW()
//        WHERE id = UUID_TO_BIN(?, 1)`,
//       [data.name, data.description, data.sort, id],
//     );
//   },

//   async delete(ids: string[]) {
//     if (!Array.isArray(ids) || ids.length === 0) return;

//     // 批次刪除 (群組 + 關聯的 group_permissions 都會被 ON DELETE CASCADE 自動清掉)
//     const placeholders = ids.map(() => 'UUID_TO_BIN(?, 1)').join(',');
//     const sql = `
//       UPDATE \`groups\`
//       SET deleted_at = NOW()
//       WHERE id IN (${placeholders})
//     `;

//     await db.query(sql, ids);
//   },

//   async clearPermissions(groupId: string) {
//     await db.query(`DELETE FROM group_permissions WHERE group_id = UUID_TO_BIN(?, 1)`, [groupId]);
//   },

//   async addPermission(groupId: string, permissionId: number) {
//     await db.query(
//       `INSERT INTO group_permissions (group_id, permission_id)
//        VALUES (UUID_TO_BIN(?, 1), ?)`,
//       [groupId, permissionId],
//     );
//   },
// };
