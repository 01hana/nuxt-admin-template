import { userRepository } from '../repositories/users';
import { db } from '../utils/db';

export const userService = {
  //  分頁查詢
  async getTable(body: any) {
    const [sortField, sortOrder] = body.sort || ['updated_at', 'desc'];
    const keyword = body.searches?.keyword || '';
    const filters = body.filters || [];
    const p = Number(body.p) || 1;
    const length = Number(body.length) || 35;
    const offset = (p - 1) * length;

    const params = {
      sortField,
      sortOrder,
      keyword,
      filters,
      length,
      offset,
    };

    // 查詢分頁資料
    const rows = await userRepository.findAll(params);

    // 查詢總數
    const total = await userRepository.countAll({
      keyword,
      filters,
    });

    return {
      data: rows,
      p,
      length,
      total,
    };
  },

  // 查單筆
  async get(id: string) {
    const data = await userRepository.findById(id);

    return data;
  },

  // 新增
  async create(data: any) {
    const { account, name, email, status, groups } = data;

    // 建立 UUID
    const [[{ id }]]: any = await db.query('SELECT UUID() AS id');

    // 插入使用者
    await userRepository.insert({
      id,
      account,
      name,
      email,
      status,
    });

    // 插入 user_groups 關聯
    if (Array.isArray(groups)) {
      for (const gid of groups) {
        await db.query(
          `INSERT INTO user_groups (user_id, group_id) 
           VALUES (UUID_TO_BIN(?, 1), UUID_TO_BIN(?, 1))`,
          [id, gid],
        );
      }
    }

    return {
      id,
      account,
      name,
      email,
      status,
      groups: groups || [],
    };
  },

  // 更新
  async update(id: string, data: any) {
    const { name, email, status } = data;

    await userRepository.update(id, { name, email, status });

    return this.get(id);
  },

  // 刪除
  async delete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'ids is required' });
    }

    await userRepository.softDelete(ids);

    return { success: true, deleted: ids };
  },
};
