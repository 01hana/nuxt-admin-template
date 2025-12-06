import { categoryRepository } from '../repositories/categories';

export const categoryService = {
  async getTable(body: any) {
    const [sortField, sortOrder] = body.sort || ['updated_at', 'desc'];
    const keyword = body.searches?.keyword || '';
    const filters = body.filters || [];
    const p = Number(body.p) || 1;
    const length = Number(body.length) || 35;
    const offset = (p - 1) * length;

    const { data, total } = await categoryRepository.findAll({
      sortField,
      sortOrder,
      keyword,
      filters,
      length,
      offset,
    });

    return {
      data,
      p,
      length,
      total,
    };
  },

  async get(id: string | number) {
    const row = await categoryRepository.findById(id);

    if (!row) return null;

    return row;
  },

  async create(data: any) {
    const { name, sort, status } = data;

    await categoryRepository.create({ name, sort, status });
  },

  async update(id: string | number, data: any) {
    const { name, sort, status } = data;

    await categoryRepository.updateCategory(id, { name, sort, status });

    return this.get(id);
  },

  async delete(ids: string[] | number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'ids is required' });
    }

    await categoryRepository.hardDelete(ids);

    return { deleted: ids };
  },
};
