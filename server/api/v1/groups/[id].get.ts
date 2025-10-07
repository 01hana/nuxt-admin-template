import { groupService } from '../../../services/groups';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Group id is required' });
  }

  const data = await groupService.get(id);

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Group not found' });
  }

  return data;
});
