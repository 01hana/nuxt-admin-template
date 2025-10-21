import UsersService from '@/services/api/users';

export const useUsers = defineStore('users', () => {
  async function getTable(params: Record<string, any>) {
    return UsersService.getTable(params);
  }

  async function getFilters(filterColumns: string[]) {
    if (!filterColumns.length) return;

    const { data: res } = await UsersService.getFilters();

    return res;
  }

  async function getGroups() {
    const { data: res } = await UsersService.getGroups();

    return res;
  }

  async function get(id: string) {
    return await UsersService.get(id);
  }

  async function create(data: Record<string, any>) {
    return await UsersService.create(data);
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await UsersService.set(id, data);

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await UsersService.remove(data);
  }

  return {
    getTable,
    getFilters,
    getGroups,
    get,
    create,
    set,
    remove,
  };
});
