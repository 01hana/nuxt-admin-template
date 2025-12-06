import GroupsService from '@/services/api/groups';

export const useGroups = defineStore('groups', () => {
  function getTable(params: Record<string, any>) {
    return GroupsService.getTable(params);
  }

  async function getFilters(filterColumns: string[]) {
    if (!filterColumns.length) return;

    const { data: res } = await GroupsService.getFilters();

    return res;
  }

  async function get(id: string) {
    return await GroupsService.get(id);
  }

  async function create(data: Record<string, any>) {
    return await GroupsService.create(data);
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await GroupsService.set(id, data);

    const { user } = storeToRefs(useAuth());
    const { getUser } = useAuth();

    const { $updateAbility } = useNuxtApp();

    if (user.value?.groups.includes(res.id)) {
      await getUser();

      $updateAbility(user.value?.permissions);
    }

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await GroupsService.remove(data);
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
