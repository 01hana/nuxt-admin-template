import CustomersService from '@/services/api/customers';

export const useCustomers = defineStore('customers', () => {
  async function getTable(params: Record<string, any>) {
    return CustomersService.getTable(params);
  }

  async function getFilters(filterColumns: string[]) {
    if (!filterColumns.length) return;

    const { data: res } = await CustomersService.getFilters();

    return res;
  }

  async function get(id: string) {
    return await CustomersService.get(id);
  }

  async function create(data: Record<string, any>) {
    return await CustomersService.create(data);
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await CustomersService.set(id, data);

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await CustomersService.remove(data);
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
