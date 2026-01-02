import CategoryService from '@/services/api/categories';

export const useCategories = defineStore('categories', () => {
  async function getTable(params: Record<string, any>) {
    return CategoryService.getTable(params);
  }

  async function get(id: string) {
    return await CategoryService.get(id);
  }

  async function getCategories() {
    const { data: res } = await CategoryService.getCategories();

    return res;
  }

  async function create(data: Record<string, any>) {
    return await CategoryService.create(data).then(() => {
      const toast = useAppToast();

      toast.success('新增成功');
    });
  }

  async function set(id: string, data: Record<string, any>) {
    const { data: res } = await CategoryService.set(id, data);

    const toast = useAppToast();

    toast.success('編輯成功');

    return res;
  }

  async function remove({ rows }: Record<string, number | string>) {
    const data = { ids: rows };

    return await CategoryService.remove(data);
  }

  return {
    getTable,
    get,
    getCategories,
    create,
    set,
    remove,
  };
});
