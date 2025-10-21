import { userRepository } from '../repositories/users';

export const userService = {
  async getTable(body: any) {
    const data = await userRepository.getTable(body);

    return data;
  },

  async get(id: string) {
    const data = await userRepository.findById(id);

    if (!data) return null;

    data.groups = await userRepository.findGroupsByUserId(id);

    return data;
  },

  async getGroups() {
    const data = await userRepository.getGroups();

    return data;
  },

  async getFilters() {
    const data = await userRepository.getFilters();

    return data;
  },

  async create(data: any) {
    const result = await userRepository.create(data);

    return result;
  },

  async update(id: string, data: any) {
    const result = await userRepository.updateUser(id, data);

    return result;
  },

  async delete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'ids is required' });
    }

    await userRepository.softDelete(ids);

    return { success: true, deleted: ids };
  },
};
