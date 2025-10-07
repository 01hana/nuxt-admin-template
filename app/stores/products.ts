import ProductService from '@/services/api/products';

export const useProducts = defineStore('products', () => {
  async function getTable(params: Record<string, any>) {
    // return ProductService.getTable(params);

    const res = {
      data: [
        {
          id: 1,
          name: 'product 1',
          price: 2000,
          images: [
            'https://vxeui.com/resource/img/546.gif',
            'https://vxeui.com/resource/img/546.gif',
            'https://vxeui.com/resource/img/546.gif',
            'https://vxeui.com/resource/img/546.gif',
            'https://vxeui.com/resource/img/546.gif',
          ],
          status: true,
        },
        { id: 2, name: 'product 2', price: 3600, images: [], status: false },
        { id: 3, name: 'product 3', price: 40 },
        { id: 4, name: 'product 4', price: 20 },
        { id: 5, name: 'product 5', price: 30 },
        { id: 6, name: 'product 6', price: 40 },
        { id: 7, name: 'product 7', price: 20 },
        { id: 8, name: 'product 8', price: 30 },
        { id: 9, name: 'product 9', price: 40 },
        { id: 10, name: 'product 10', price: 20 },
        { id: 11, name: 'product 11', price: 30 },
        { id: 12, name: 'product 12', price: 40 },
        { id: 13, name: 'product 13', price: 20 },
        { id: 14, name: 'product 14', price: 30 },
        { id: 15, name: 'product 15', price: 40 },
        { id: 16, name: 'product 16', price: 20 },
        { id: 17, name: 'product 17', price: 30 },
        { id: 18, name: 'product 18', price: 40 },
        { id: 19, name: 'product 19', price: 20 },
        { id: 20, name: 'product 20', price: 30 },
        { id: 21, name: 'product 21', price: 40 },
        { id: 22, name: 'product 22', price: 20 },
        { id: 23, name: 'product 23', price: 30 },
        { id: 24, name: 'product 24', price: 40 },
        { id: 25, name: 'product 25', price: 20 },
        { id: 26, name: 'product 26', price: 30 },
        { id: 27, name: 'product 27', price: 40 },
        { id: 28, name: 'product 28', price: 20 },
        { id: 29, name: 'product 29', price: 30 },
        { id: 30, name: 'product 30', price: 40 },
        { id: 31, name: 'product 31', price: 20 },
        { id: 32, name: 'product 32', price: 30 },
        { id: 33, name: 'product 33', price: 40 },
        { id: 34, name: 'product 34', price: 20 },
        { id: 35, name: 'product 35', price: 30 },
        { id: 36, name: 'product 36', price: 40 },
        { id: 37, name: 'product 37', price: 20 },
        { id: 38, name: 'product 38', price: 30 },
      ],
      p: 1,
      total: 38,
    };

    return res;
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
    return await ProductService.create(data);
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await ProductService.set(id, data);

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await ProductService.remove(data);
  }

  async function actions() {}

  return {
    getTable,
    getFilters,
    get,
    create,
    set,
    remove,
  };
});
