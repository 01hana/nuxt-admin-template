import { productRepository } from '../repositories/products';
import { appError } from '../utils/appError';

export const productService = {
  async getTable(categoryId: string | number, body: any) {
    if (!categoryId) {
      throw appError(400, 'categoryId is required');
    }

    const [sortField, sortOrder] = body.sort || ['updated_at', 'desc'];
    const keyword = body.searches?.keyword || '';

    // filters 一定要是 Object
    const filters = body.filters && typeof body.filters === 'object' ? { ...body.filters } : {};

    // 把 categoryId 當成 filter 過濾
    filters.category_id = categoryId;

    const p = Number(body.p) || 1;
    const length = Number(body.length) || 35;
    const offset = (p - 1) * length;

    const { data, total } = await productRepository.findAll({
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
    const row = await productRepository.findById(id);

    if (!row) return null;

    return row;
  },

  async create(categoryId: string, data: any) {
    const { name, sort, status } = data;

    await productRepository.create({ name, sort, status });
  },

  async update(id: string | number, data: any) {
    const { name, sort, status } = data;

    await productRepository.updateCategory(id, { name, sort, status });

    return this.get(id);
  },

  async delete(ids: string[] | number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'ids is required' });
    }

    await productRepository.hardDelete(ids);

    return { deleted: ids };
  },
};
