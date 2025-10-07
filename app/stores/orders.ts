import OrdersService from '@/services/api/orders';

export const useOrders = defineStore('orders', () => {
  async function getTable(params: Record<string, any>) {
    return OrdersService.getTable(params);
  }

  async function getFilters(filterColumns: string[]) {
    if (!filterColumns.length) return;

    const { data: res } = await OrdersService.getFilters();

    return res;
  }

  async function get(id: string) {
    return await OrdersService.get(id);
  }

  async function create(data: Record<string, any>) {
    return await OrdersService.create(data);
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await OrdersService.set(id, data);

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await OrdersService.remove(data);
  }

  return {
    getTable,
    getFilters,
    get,
    create,
    set,
    remove,
  };
});
