import { groupRepository } from '../repositories/groups';
import { permissionRepository } from '../repositories/permission';

export const groupService = {
  //  分頁查詢
  async getTable(body: any) {
    const [sortField, sortOrder] = body.sort || ['updated_at', 'desc'];
    const keyword = body.searches?.keyword || '';
    const filters = body.filters || [];
    const p = Number(body.p) || 1;
    const length = Number(body.length) || 35;
    const offset = (p - 1) * length;

    // 查詢分頁資料
    const rows = await groupRepository.findAll({
      sortField,
      sortOrder,
      keyword,
      filters,
      length,
      offset,
    });

    // 查詢總數
    const total = await groupRepository.countAll({
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

  // 查單筆 + 權限
  async get(id: string) {
    const group = await groupRepository.findById(id);

    if (!group) return null;

    const permissions = await permissionRepository.findByGroupId(id);

    group.permissions = permissions;

    return group;
  },

  async create(data: any) {
    const { name, description, sort, permissions } = data;

    // 建立群組 UUID
    const [[{ id }]]: any = await db.query('SELECT UUID() AS id');

    // 插入群組
    await groupRepository.insert({ id, name, description, sort: sort ?? 0 });

    // 插入群組權限
    if (Array.isArray(permissions)) {
      for (const perm of permissions) {
        const permRecord = await permissionRepository.findBySubjectAndAction(
          perm.subject,
          perm.action,
        );
        if (permRecord) await groupRepository.addPermission(id, permRecord.id);
      }
    }

    return this.get(id);
  },

  // 更新群組 + 權限
  async update(id: string, data: any) {
    const { name, description, sort, permissions } = data;

    await groupRepository.update(id, { name, description, sort });

    await groupRepository.clearPermissions(id);

    for (const perm of permissions) {
      const permRecord = await permissionRepository.findBySubjectAndAction(
        perm.subject,
        perm.action,
      );

      if (permRecord) await groupRepository.addPermission(id, permRecord.id);
    }

    return this.get(id);
  },

  // 刪除群組
  async delete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'ids is required' });
    }

    await groupRepository.softDelete(ids);

    return { success: true, deleted: ids };
  },
};
