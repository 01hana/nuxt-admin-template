import ProductService from '@/services/api/products';

export const useProducts = defineStore('products', () => {
  const categoryId = ref(0);

  async function getTable(params: Record<string, any>) {
    return ProductService.getTable(categoryId.value, params);
  }

  async function getFilters(filterColumns: string[]) {
    if (!filterColumns.length) return;

    const { data: res } = await ProductService.getFilters();

    return res;
  }

  async function get(id: string) {
    return await ProductService.get(id);
  }

  async function create(data: Record<string, any>) {
    return await ProductService.create(categoryId.value, data);
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await ProductService.set(id, data);

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await ProductService.remove(categoryId.value, data);
  }

  async function actions() {}

  return {
    categoryId,

    getTable,
    getFilters,
    get,
    create,
    set,
    remove,
  };
});
